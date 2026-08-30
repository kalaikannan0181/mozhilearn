'use client'

import { BookOpenText, Menu, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'For Teachers', href: '#how-it-works' },
  { label: 'For Students', href: '#demo' },
  { label: 'About', href: '#impact' },
  { label: 'Contact', href: '#contact' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? 'border-border bg-background/90 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-background'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        <a
          href="#home"
          className="flex items-center gap-2.5 rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpenText className="size-5" aria-hidden="true" />
            <Sparkles
              className="absolute -top-1 -right-1 size-4 text-accent"
              aria-hidden="true"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              MozhiLearn
            </span>
            <span className="font-tamil text-[11px] text-muted-foreground">
              மொழி கற்றல்
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/teacher/login"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Teacher Login
          </a>
          <a
            href="/student/login"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Student Login
          </a>
          <a
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:outline-none"
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-4 pt-3 pb-6 sm:px-6 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/teacher/login"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 text-base font-semibold text-foreground"
            >
              Teacher Login
            </a>
            <a
              href="/student/login"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 text-base font-semibold text-foreground"
            >
              Student Login
            </a>
            <a
              href="/signup"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-5 text-base font-semibold text-accent-foreground shadow-sm"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
