// Server-side relay for the contact form. The browser only talks to this site,
// so ad blockers / network filters that block form services cannot break it.
const OWNER_EMAIL = process.env.CONTACT_EMAIL || 'sumanjha0906@gmail.com'

export async function relay(body, origin) {
  const name = String(body?.name ?? '').trim().slice(0, 120)
  const email = String(body?.email ?? '').trim().slice(0, 200)
  const message = String(body?.message ?? '').trim().slice(0, 5000)
  if (body?._honey) return { status: 200, json: { success: true } } // bots
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !message) {
    return { status: 400, json: { success: false, error: 'invalid' } }
  }
  const subject = `Portfolio enquiry from ${name}`
  try {
    const url = process.env.CONTACT_UPSTREAM || `https://formsubmit.co/ajax/${OWNER_EMAIL}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: origin, Referer: origin + '/' },
      body: JSON.stringify({ name, email, message, _subject: subject, _replyto: email, _template: 'table' }),
    })
    const data = await res.json().catch(() => ({}))
    const ok = res.ok && data.success !== 'false' && data.success !== false
    if (ok) return { status: 200, json: { success: true } }
    const needsActivation = /activation/i.test(String(data?.message ?? ''))
    return { status: 502, json: { success: false, error: needsActivation ? 'activation' : 'upstream' } }
  } catch {
    return { status: 502, json: { success: false, error: 'network' } }
  }
}
