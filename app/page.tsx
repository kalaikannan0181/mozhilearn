import { CtaSection } from '@/components/cta-section'
import { DemoSection } from '@/components/demo-section'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { MissionBand } from '@/components/impact-stats'
import { Problem } from '@/components/problem'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { Solution } from '@/components/solution'
import { PrototypeNote } from '@/components/testimonials'

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteNav />
      <main id="main-content">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <DemoSection />
        <PrototypeNote />
        <MissionBand />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
