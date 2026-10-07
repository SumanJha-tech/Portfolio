import { useState, type FormEvent } from 'react'
import { profile } from '../data/content'
import { IconGitHub, IconLinkedIn, IconMail, IconPhone } from '../lib/icons'
import { useReveal } from '../lib/useReveal'

// Form delivery. Messages always go to the owner inbox (never the visitor). Tried in this order:
//  1) Web3Forms from the browser, if VITE_WEB3FORMS_KEY is set (free plan only accepts browser requests; no activation click).
//  2) The site's own relay /api/contact -> FormSubmit (not affected by ad blockers).
//  3) FormSubmit directly from the browser.
// If all fail, an error with the direct email address is shown (the mail app is never opened automatically).
const W3_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined
const FORMSUBMIT = `https://formsubmit.co/ajax/${profile.email}`

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!emailRe.test(v.email.trim())) e.email = 'Enter a valid email, like name@company.com.'
  if (!v.message.trim()) e.message = 'Please write a message.'
  return e
}

export function Contact() {
  const ref = useReveal<HTMLDivElement>()
  const [vals, setVals] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [honey, setHoney] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (k: keyof typeof vals) => (e: { target: { value: string } }) => {
    setVals((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(vals)
    setErrors(errs)
    setStatus('idle')
    if (Object.keys(errs).length) {
      const first = (['name', 'email', 'message'] as const).find((k) => errs[k])
      if (first) document.getElementById(`c-${first}`)?.focus()
      return
    }
    if (honey) { setStatus('sent'); return } // bots fill the hidden field
    setStatus('sending')
    const subject = `Portfolio enquiry from ${vals.name.trim()}`
    const fields = { name: vals.name.trim(), email: vals.email.trim(), message: vals.message.trim() }
    const post = async (url: string, body: unknown, accept = 'application/json') => {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: accept }, body: JSON.stringify(body) })
      const data = await res.json().catch(() => ({}))
      const ok = res.ok && data.success !== 'false' && data.success !== false
      return { ok, data }
    }
    const viaWeb3Forms = async () => {
      if (!W3_KEY) throw new Error('no key')
      const { ok } = await post('https://api.web3forms.com/submit', { access_key: W3_KEY, subject, from_name: fields.name, ...fields })
      if (!ok) throw new Error('web3forms failed')
    }
    const viaRelay = async () => {
      const { ok, data } = await post('/api/contact', fields)
      if (!ok) {
        if (data.error === 'activation') console.warn('[contact form] FormSubmit needs one-time activation for this site address: open the "Activate Form" email sent to the owner, or set VITE_WEB3FORMS_KEY (see DEPLOY_VERCEL.md, Part 3).')
        throw new Error('relay failed')
      }
    }
    const viaFormSubmit = async () => {
      const { ok } = await post(FORMSUBMIT, { ...fields, _subject: subject, _replyto: fields.email, _template: 'table' })
      if (!ok) throw new Error('formsubmit failed')
    }
    try {
      for (const step of [viaWeb3Forms, viaRelay, viaFormSubmit]) {
        try { await step(); setStatus('sent'); setVals({ name: '', email: '', message: '' }); return } catch { /* try next route */ }
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { setCopied(false) }
  }

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="wrap reveal" ref={ref}>
        <div className="contact-grid">
          <div>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Contact</span>
              <h2 id="contact-title">Let’s talk.</h2>
              <p>Open to Data, Supply Chain, Quick Commerce, BI and Risk Analyst roles, remote, hybrid or relocation worldwide. Email is the fastest way to reach me.</p>
            </div>
            <div className="contact-links">
              <a className="card clink" href={`mailto:${profile.email}`}><IconMail /><span><b>{profile.email}</b><small>Email</small></span></a>
              <a className="card clink" href={profile.phoneHref}><IconPhone /><span><b>{profile.phone}</b><small>Phone</small></span></a>
              <a className="card clink" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><IconLinkedIn /><span><b>linkedin.com/in/sumanjha-tech</b><small>LinkedIn</small></span></a>
              <a className="card clink" href={profile.github} target="_blank" rel="noopener noreferrer"><IconGitHub /><span><b>github.com/SumanJha-tech</b><small>GitHub</small></span></a>
              <button className="btn" onClick={copy} style={{ justifySelf: 'start' }}>{copied ? 'Email copied' : 'Copy email address'}</button>
            </div>
          </div>
          <form className="card form" onSubmit={submit} noValidate aria-labelledby="form-title">
            <h3 id="form-title" style={{ fontSize: 24 }}>Send a message</h3>
            <label className="field">Name
              <input id="c-name" type="text" autoComplete="name" value={vals.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby="e-name" />
              <span className="err-msg" id="e-name" role={errors.name ? 'alert' : undefined}>{errors.name}</span>
            </label>
            <label className="field">Email
              <input id="c-email" type="email" autoComplete="email" value={vals.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby="e-email" />
              <span className="err-msg" id="e-email" role={errors.email ? 'alert' : undefined}>{errors.email}</span>
            </label>
            <label className="field">Message
              <textarea id="c-message" value={vals.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby="e-message" />
              <span className="err-msg" id="e-message" role={errors.message ? 'alert' : undefined}>{errors.message}</span>
            </label>
            <input className="hp" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honey} onChange={(e) => setHoney(e.target.value)} />
            <button className="btn primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
            <div role="status" aria-live="polite">
              {status === 'sent' && <p className="form-status">Thanks! Your message was sent. I will reply to the email you gave.</p>}
              {status === 'error' && <p className="form-status error">Sorry, the message could not be sent right now (a browser extension or network filter can cause this). Please email me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
