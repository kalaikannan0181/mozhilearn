import { CtaSection } from '@/components/cta-section'
import { DemoSection } from '@/components/demo-section'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { ImpactStats } from '@/components/impact-stats'
import { Problem } from '@/components/problem'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { Solution } from '@/components/solution'
import { Testimonials } from '@/components/testimonials'

export default function HomePage() {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <DemoSection />
        <Testimonials />
        <ImpactStats />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
