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
    <div
      className="relative isolate overflow-hidden bg-[#FFFBEB]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(29, 78, 216, 0.045) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(29, 78, 216, 0.045) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
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
    </div>
  )
}
