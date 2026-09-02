'use client'

import { Button } from '@/components/ui/button'
import { MozhiLogo } from '@/components/logo'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'About', href: '#footer' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <MozhiLogo href="#" size="sm" />

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button size="lg" className="h-10 rounded-full px-5 font-bold shadow-sm">
          Get Started
        </Button>
      </div>
    </header>
  )
}
