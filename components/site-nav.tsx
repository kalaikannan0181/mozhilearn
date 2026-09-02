'use client'

import { BookOpenText, ChevronDown, Download, LogIn, Menu, ShieldCheck, Sparkles, Wifi, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MozhiLogo } from '@/components/logo'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'For Teachers', href: '/#how-it-works' },
  { label: 'For Students', href: '/#demo' },
  { label: 'About', href: '/about' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showPwaModal, setShowPwaModal] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleInstallClick = () => {
    setShowPwaModal(true)
  }

  const handleConfirmInstall = () => {
    setIsInstalled(true)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled
          ? 'border-border bg-background/95 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-background'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* Logo */}
        <MozhiLogo href="/" subtext="Multilingual Pedagogy" size="md" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3.5 text-xs font-bold text-primary transition-all hover:bg-primary/10"
          >
            <Download className="size-3.5" aria-hidden="true" />
            {isInstalled ? 'Works Offline' : 'Install App'}
          </button>

          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Login
          </a>
          <a
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          id="mobile-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-4 pt-3 pb-6 sm:px-6 lg:hidden space-y-3"
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
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => { setOpen(false); handleInstallClick(); }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 text-sm font-bold text-primary"
            >
              <Download className="size-4" />
              {isInstalled ? 'Works Offline' : 'Install App'}
            </button>
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <LogIn className="size-4.5" aria-hidden="true" />
              Login
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

      {/* Feature 6 PWA Install Prompt Modal */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-extrabold">
                <Download className="h-5 w-5" />
                <span>Install MozhiLearn PWA</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPwaModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">PWA Status</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {isInstalled ? 'Works Offline' : 'Ready to Install'}
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground">
                Installable from browser to home screen
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Works offline after initial setup</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Auto-updates content when internet is available</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary"
              >
                Close
              </button>
              {!isInstalled ? (
                <button
                  type="button"
                  onClick={handleConfirmInstall}
                  className="rounded-xl bg-accent px-4 py-2 text-xs font-extrabold text-accent-foreground shadow-xs hover:bg-accent/90"
                >
                  Install Now
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-extrabold text-emerald-600 border border-emerald-500/20">
                  Installed & Works Offline
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

