import { BookOpenText, Heart, Mail, MapPin, Sparkles } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Demo', href: '#demo' },
      { label: 'Impact', href: '#impact' },
    ],
  },
  {
    title: 'For Schools',
    links: [
      { label: 'For Teachers', href: '#how-it-works' },
      { label: 'For Students', href: '#demo' },
      { label: 'NEP 2020 Alignment', href: '#problem' },
      { label: 'Onboarding Guide', href: '#cta' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#impact' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Privacy Policy', href: '#contact' },
      { label: 'Terms of Use', href: '#contact' },
    ],
  },
]

const socials = [
  {
    label: 'X (Twitter)',
    href: '#contact',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'LinkedIn',
    href: '#contact',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0',
  },
  {
    label: 'YouTube',
    href: '#contact',
    path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81M9.55 15.57V8.43L15.82 12z',
  },
]

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
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
            <ul className="mt-6 flex flex-col gap-3 text-sm text-background/70">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:hello@mozhilearn.in"
                  className="hover:text-background"
                >
                  hello@mozhilearn.in
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                Tamil Nadu, India
              </li>
            </ul>
            <ul className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-xl border border-background/20 text-background/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4.5"
                      aria-hidden="true"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-8 sm:flex-row">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} MozhiLearn. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-sm font-semibold text-background">
            Made with
            <Heart className="size-4 fill-accent text-accent" aria-hidden="true" />
            for SIH 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
