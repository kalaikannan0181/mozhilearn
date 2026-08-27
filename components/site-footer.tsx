import { Sparkles } from 'lucide-react'

const footerColumns = [
  {
    heading: 'Product',
    links: ['Features', 'For Teachers', 'For Students', 'Pricing'],
  },
  {
    heading: 'Resources',
    links: ['Help Center', 'Lesson Library', 'Blog', 'Community'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Careers', 'Privacy', 'Contact'],
  },
]

export function SiteFooter() {
  return (
    <footer id="footer" className="scroll-mt-20 border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="#" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
                MozhiLearn
              </span>
            </a>
            <p className="mt-4 max-w-xs font-medium leading-relaxed text-muted-foreground">
              Helping primary students fall in love with their mother tongue,
              one playful lesson at a time.
            </p>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-foreground">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm font-medium text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MozhiLearn. Made with care for young learners.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
