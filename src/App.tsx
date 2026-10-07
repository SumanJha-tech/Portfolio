import { useCallback, useState } from 'react'
import { CaseDialog } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { About, Experience, Footer, LabSection, Skills } from './components/Sections'

export default function App() {
  const [study, setStudy] = useState<string | null>(null)
  const open = useCallback((id: string) => setStudy(id), [])
  const close = useCallback(() => setStudy(null), [])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects onCase={open} />
        <LabSection />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <CaseDialog id={study} setId={setStudy} onClose={close} />
    </>
  )
}
