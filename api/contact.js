import { relay } from './_relay.js'

// Vercel serverless function: POST /api/contact
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false })
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const origin = `https://${host}`
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  const out = await relay(body, origin)
  return res.status(out.status).json(out.json)
}
