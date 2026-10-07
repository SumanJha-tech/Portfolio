import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset URLs relative so the same build works on Vercel and any static host.
export default defineConfig({
  base: './',
  plugins: [react(), contactApi()],
  build: { target: 'es2020', chunkSizeWarningLimit: 600 },
})

/** Serves POST /api/contact in `npm run dev` and `npm run preview`, mirroring the Vercel function in /api. */
function contactApi(): Plugin {
  const mount = (server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) => {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/contact')) return next()
      if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
      let raw = ''
      for await (const chunk of req) raw += chunk
      // @ts-expect-error plain JS module without types
      const { relay } = await import('./api/_relay.js')
      let body = {}
      try { body = JSON.parse(raw || '{}') } catch { /* invalid JSON -> rejected by relay */ }
      const out = await relay(body, `http://${req.headers.host}`)
      res.statusCode = out.status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(out.json))
    })
  }
  return {
    name: 'contact-api',
    config(_, { mode }) {
      // make .env values (e.g. VITE_WEB3FORMS_KEY) visible to the relay in dev/preview
      const env = loadEnv(mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v
    },
    configureServer: mount,
    configurePreviewServer: mount,
  }
}
