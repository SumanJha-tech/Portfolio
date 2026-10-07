import { certifications, profile, projects } from '../data/content'
import { IconArrow, IconDownload, IconGitHub, IconLinkedIn } from '../lib/icons'

const liveApps = projects.filter((p) => p.status === 'Live demo').length

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="status-pill"><i aria-hidden="true" /> Open to remote, hybrid, on-site and relocation</span>
          <h1 id="hero-title">
            I turn messy operational data into <em>decisions</em>.
          </h1>
          <p className="lede">
            Data Analyst at Delta Analytics with 1+ year of experience in supply chain and procurement data, ETL and process automation. I also build SQL, Python and GenAI projects end to end, with live demos.
          </p>
          <div className="cta-row">
            <a className="btn primary" href="#projects">See my work <IconArrow /></a>
            <a className="btn" href={profile.resume} download="Suman_Jha_Resume.pdf">Resume <IconDownload /></a>
            <a className="btn icon" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><IconLinkedIn /></a>
            <a className="btn icon" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><IconGitHub /></a>
          </div>
          <dl className="hero-stats">
            <div><dt>Since Jul 2025</dt><dd>Data Analyst</dd></div>
            <div><dt>{liveApps} live apps</dt><dd>deployed</dd></div>
            <div><dt>{certifications.length} certifications</dt><dd>SAP · Oracle · Salesforce</dd></div>
          </dl>
        </div>
        <figure className="portrait">
          <div className="portrait-frame">
            <img src={profile.photo} alt="Portrait of Suman Jha" width="720" height="900" fetchPriority="high" />
          </div>
        </figure>
      </div>
    </section>
  )
}
