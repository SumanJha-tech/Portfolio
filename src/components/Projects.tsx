import { useMemo, useState } from 'react'
import { allTags, projects, type Project, type Tag } from '../data/content'
import { IconArrow, IconGitHub } from '../lib/icons'
import { useReveal } from '../lib/useReveal'

function badgeClass(s: Project['status']) {
  return s === 'Live demo' ? 'badge' : s === 'In progress' ? 'badge warn' : 'badge neutral'
}

function Card({ p, onCase }: { p: Project; onCase: (id: string) => void }) {
  const big = !!p.featured
  return (
    <article className={`card pcard${big ? ' feat' : ''}`} aria-labelledby={`p-${p.id}`}>
      <span className="kicker">{p.kicker}</span>
      <h3 id={`p-${p.id}`}>{p.title}</h3>
      <span className={badgeClass(p.status)}>{p.status}</span>
      <p className="sum">{p.summary}</p>
      {big && (
        <div className="pfacts">
          {p.facts.map((f) => (<div key={f.label}><b>{f.value}</b><span>{f.label}</span></div>))}
        </div>
      )}
      <ul className="stack" aria-label="Technology stack">{p.stack.slice(0, big ? 8 : 5).map((s) => <li key={s}><span>{s}</span></li>)}</ul>
      <p className="datanote">{p.dataNote}</p>
      <div className="plinks">
        {p.caseStudy && <button className="btn small primary" onClick={() => onCase(p.caseStudy!)}>Case study</button>}
        {p.demo && <a className="btn small" href={p.demo} target="_blank" rel="noopener noreferrer">Live demo <IconArrow /></a>}
        {p.repo && <a className="btn small" href={p.repo} target="_blank" rel="noopener noreferrer">Code <IconGitHub /></a>}
        {p.repos?.map((r) => <a key={r.href} className="btn small" href={r.href} target="_blank" rel="noopener noreferrer">{r.label} <IconGitHub /></a>)}
      </div>
    </article>
  )
}

export function Projects({ onCase }: { onCase: (id: string) => void }) {
  const [tag, setTag] = useState<Tag | 'All'>('All')
  const ref = useReveal<HTMLDivElement>()
  const shown = useMemo(() => (tag === 'All' ? projects : projects.filter((p) => p.tags.includes(tag))), [tag])
  const count = (t: Tag) => projects.filter((p) => p.tags.includes(t)).length

  return (
    <section id="projects" aria-labelledby="projects-title">
      <div className="wrap reveal" ref={ref}>
        <div className="sec-top">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 id="projects-title">Real projects, real code.</h2>
          </div>
          <p className="sec-note">Each card says what is live and what is synthetic.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter projects by skill">
          {(['All', ...allTags] as const).map((t) => (
            <button key={t} className="filter" aria-pressed={tag === t} onClick={() => setTag(t)}>
              {t}<small>{t === 'All' ? projects.length : count(t)}</small>
            </button>
          ))}
          <span className="result-count" role="status" aria-live="polite">{shown.length} of {projects.length} projects</span>
        </div>
        <div className="bento">
          {shown.map((p) => <Card key={p.id} p={p} onCase={onCase} />)}
        </div>
      </div>
    </section>
  )
}
