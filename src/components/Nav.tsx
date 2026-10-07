import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import { IconClose, IconDownload, IconMenu } from '../lib/icons'

const links = [
  ['about', 'About'],
  ['projects', 'Work'],
  ['lab', 'Analytics Lab'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
] as const

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-in">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <img src="./favicon.svg" alt="" width="30" height="30" />
          Suman Jha
        </a>
        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <IconClose /> : <IconMenu />}
        </button>
        <nav id="site-nav" aria-label="Primary" className={`nav-links${open ? ' open' : ''}`}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="btn small primary nav-cta" href={profile.resume} download="Suman_Jha_Resume.pdf">Resume <IconDownload /></a>
        </nav>
      </div>
    </header>
  )
}
