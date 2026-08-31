import { BookOpenText, Heart, MapPin, Sparkles } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Prototype Preview', href: '#demo' },
      { label: 'About', href: '#about' },
    ],
  },
  {
    title: 'For Schools',
    links: [
      { label: 'For Teachers', href: '#how-it-works' },
      { label: 'For Students', href: '#demo' },
      { label: 'NEP 2020 Alignment', href: '#problem' },
      { label: 'Get Started', href: '/signup' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Teacher Login', href: '/login' },
      { label: 'Student Login', href: '/login' },
      { label: 'Create Account', href: '/signup' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <BookOpenText className="size-5" aria-hidden="true" />
                <Sparkles
                  className="absolute -top-1 -right-1 size-4 text-accent"
                  aria-hidden="true"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight">
                  MozhiLearn
                </span>
                <span className="font-tamil text-[11px] text-background/60">
                  மொழி கற்றல்
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/70">
              AI-powered mother tongue learning for Indian primary schools.
              Built so that no child has to learn in a language they do not
              speak.
            </p>

            {/* Tagline */}
            <p className="mt-4 font-tamil text-sm text-background/50">
              கற்றல் அனைவருக்கும்
            </p>

            {/* Location only — no fake email or social links */}
            <ul className="mt-6 flex flex-col gap-3 text-sm text-background/70">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                Nandha Engineering College, Erode, Tamil Nadu
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-sm font-bold tracking-wide text-background uppercase">
                {column.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-background/70 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-8 sm:flex-row">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} MozhiLearn. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-sm font-semibold text-background">
              Made with
              <Heart className="size-4 fill-accent text-accent" aria-hidden="true" />
              for SIH 2026
            </p>
            <p className="text-xs text-background/40">
              Built by Team MozhiTech · SIH26042 — Smart Education
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
