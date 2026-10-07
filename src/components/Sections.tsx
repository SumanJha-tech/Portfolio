import { lazy, Suspense } from 'react'
import { about, certifications, coreStack, currently, domains, education, experience, profile, skillGroups, targetRoles } from '../data/content'
import { useReveal } from '../lib/useReveal'
import { ErrorBoundary } from './ErrorBoundary'

const Lab = lazy(() => import('./Lab'))

export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap reveal" ref={ref}>
        <div className="about-grid">
          <div>
            <span className="eyebrow">About</span>
            <h2 id="about-title">Analytics, automation and a bit of AI.</h2>
            <div className="prose">{about.map((t) => <p key={t}>{t}</p>)}</div>
            <ul className="chips" aria-label="Core stack">
              {coreStack.map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
          </div>
          <div className="card now-card">
            <h3>Right now</h3>
            <dl className="now">
              {currently.map((c) => (<div key={c.label}><dt>{c.label}</dt><dd>{c.text}</dd></div>))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LabSection() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="lab" className="alt" aria-labelledby="lab-title">
      <div className="wrap reveal" ref={ref}>
        <div className="sec-top">
          <div>
            <span className="eyebrow">Analytics Lab</span>
            <h2 id="lab-title">Explore the data yourself.</h2>
          </div>
          <p className="sec-note">Working charts built on the data from my projects. Each view says if the data is synthetic or real.</p>
        </div>
        <ErrorBoundary label="The Analytics Lab">
          <Suspense fallback={<div className="card loading" role="status">Loading charts…</div>}>
            <Lab />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  )
}

export function Experience() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="experience" aria-labelledby="exp-title">
      <div className="wrap reveal" ref={ref}>
        <div className="sec-top">
          <div>
            <span className="eyebrow">Experience</span>
            <h2 id="exp-title">What I own day to day.</h2>
          </div>
        </div>
        <div className="exp-grid">
          <article className="card role">
            <div className="role-head">
              <div>
                <h3>{experience.role}</h3>
                <p className="co">{experience.company}</p>
                <p className="co-sub">{experience.sub}</p>
              </div>
              <p className="when">{experience.period} · {experience.type}</p>
            </div>
            <ul>{experience.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </article>
          <div className="card edu">
            <h3>Education</h3>
            <p className="d"><b>{education.degree}</b><br />{education.school}<br />{education.specialization}<br /><span className="muted">{education.cgpa} · {education.period}</span></p>
            <p className="d small">{education.note}</p>
          </div>
        </div>
        <div className="card certs">
          <h3>Licenses &amp; certifications <small>{certifications.length} listed</small></h3>
          <ul>
            {certifications.map((c) => (
              <li key={c.name}><b>{c.name}</b><span>{c.issuer} · {c.date}</span>{c.url && <a href={c.url} target="_blank" rel="noopener noreferrer">View credential</a>}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="skills" className="alt" aria-labelledby="skills-title">
      <div className="wrap reveal" ref={ref}>
        <div className="sec-top">
          <div>
            <span className="eyebrow">Skills &amp; domain</span>
            <h2 id="skills-title">What I know and the tools I use.</h2>
          </div>
          <p className="sec-note">I work with purchase-order data from vendor portals every day and collect it automatically with web crawling.</p>
        </div>

        <h3 className="sub-h">Domain knowledge</h3>
        <div className="domain-grid">
          {domains.map((d) => (
            <article className="card domain-card" key={d.title}>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </article>
          ))}
        </div>
        <div className="roles">
          <span className="roles-label">Roles I am looking for</span>
          <ul className="chips" aria-label="Target roles">
            {targetRoles.map((r) => <li key={r} className="chip">{r}</li>)}
          </ul>
        </div>

        <h3 className="sub-h">Tools and technologies</h3>
        <div className="card skill-table">
          {skillGroups.map((g) => (
            <div className="skill-row" key={g.id}>
              <h3>{g.title}</h3>
              <ul>{g.items.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="wrap legal">
        <span>© {new Date().getFullYear()} Suman Jha · Data Analyst</span>
        <nav aria-label="Footer" className="foot-links">
          <a href="#projects">Work</a>
          <a href="#lab">Lab</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={profile.resume} download="Suman_Jha_Resume.pdf">Resume</a>
        </nav>
        <span>Data: Open-Meteo, Olist public dataset</span>
      </div>
    </footer>
  )
}
