import { useEffect, useRef } from 'react'
import { caseStudies, type CaseStudy } from '../data/content'
import { IconArrow, IconClose } from '../lib/icons'
import { AgentDiagram, PoDiagram, WeatherDiagram } from './Diagrams'

const diagrams = { weather: WeatherDiagram, agent: AgentDiagram, po: PoDiagram }
const diagramCaption = {
  weather: 'Sales and weather meet on city + date; the hosted app reads a CSV snapshot instead of PostgreSQL.',
  agent: 'Every question is grounded in the live schema; failures fall back to retries or saved real answers.',
  po: 'Main workflow stages only. No company, client or system details are shown.',
}

function List({ items }: { items: string[] }) {
  return <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
}

function Study({ cs }: { cs: CaseStudy }) {
  const Diagram = diagrams[cs.diagram]
  return (
    <div className="cs" role="tabpanel" id={`cs-${cs.id}`} aria-labelledby={`tab-${cs.id}`}>
      <h3 id="cs-heading">{cs.title}</h3>
      <p className="one">{cs.oneLiner}</p>
      <p className="simple"><b>In short</b>{cs.simple}</p>
      <p className="ctx">{cs.context}</p>
      <div className="cs-grid">
        <div className="cs-block wide"><h4>Business problem</h4><p>{cs.problem}</p></div>
        <div className="cs-block"><h4>Data</h4><List items={cs.data} /></div>
        <div className="cs-block"><h4>Methodology</h4><List items={cs.method} /></div>
        <div className="cs-block wide">
          <h4>Architecture</h4>
          <div className="diagram"><Diagram /></div>
          <p className="chart-note">{diagramCaption[cs.diagram]}</p>
        </div>
        <div className="cs-block">
          <h4>Technology stack</h4>
          <table className="stack-table"><tbody>{cs.stack.map((s) => <tr key={s.layer}><th scope="row">{s.layer}</th><td>{s.choice}</td></tr>)}</tbody></table>
        </div>
        <div className="cs-block"><h4>Implementation</h4><List items={cs.implementation} /></div>
        <div className="cs-block wide">
          <h4>Insights</h4>
          <div className="insights">{cs.insights.map((i) => <div className="insight" key={i.label}><b>{i.label}</b><span>{i.text}</span></div>)}</div>
          {cs.estimateNote && <p className="estimate"><b>Synthetic data.</b> {cs.estimateNote}</p>}
        </div>
        <div className="cs-block"><h4>Limitations</h4><List items={cs.limitations} /></div>
        <div className="cs-block"><h4>Recommendations</h4><List items={cs.recommendations} /></div>
      </div>
      <div className="plinks" style={{ marginTop: 24 }}>
        {cs.links.map((l, i) => (
          <a key={l.href} className={`btn small${i === 0 ? ' primary' : ''}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <IconArrow /></a>
        ))}
      </div>
    </div>
  )
}

/** Case studies open in a native modal <dialog>: focus trap, Esc to close, and backdrop click come from the browser. */
export function CaseDialog({ id, setId, onClose }: { id: string | null; setId: (id: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const cs = caseStudies.find((c) => c.id === id)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (id && !d.open) { d.showModal(); document.documentElement.classList.add('lock') }
    if (!id && d.open) d.close()
    if (!id) document.documentElement.classList.remove('lock')
    bodyRef.current?.scrollTo({ top: 0 })
  }, [id])

  return (
    <dialog
      ref={ref}
      className="cs-dialog"
      aria-labelledby="cs-heading"
      onClose={() => { document.documentElement.classList.remove('lock'); onClose() }}
      onClick={(e) => { if (e.target === ref.current) ref.current?.close() }}
    >
      <div className="cs-bar">
        <div className="tabs" role="tablist" aria-label="Case studies">
          {caseStudies.map((c) => (
            <button key={c.id} id={`tab-${c.id}`} role="tab" className="tab" aria-selected={c.id === id} aria-controls={`cs-${c.id}`} onClick={() => setId(c.id)}>{c.tabLabel}</button>
          ))}
        </div>
        <button className="btn small icon" onClick={() => ref.current?.close()} aria-label="Close case study"><IconClose /></button>
      </div>
      <div className="cs-body" ref={bodyRef}>{cs && <Study cs={cs} />}</div>
    </dialog>
  )
}
