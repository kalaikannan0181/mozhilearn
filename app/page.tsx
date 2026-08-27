import { FeaturesSection } from '@/components/features-section'
import { HeroSection } from '@/components/hero-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TestimonialsSection } from '@/components/testimonials-section'

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <SiteFooter />
    </div>
  )
}
