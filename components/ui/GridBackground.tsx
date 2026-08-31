import type { HTMLAttributes, ReactNode } from 'react'

interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export default function GridBackground({
  children,
  className = "",
  ...props
}: GridBackgroundProps) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-[#FFFBEB] ${className}`}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(29, 78, 216, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(29, 78, 216, 0.12) 1px, transparent 1px),
            radial-gradient(circle at 76% 22%, rgba(249, 115, 22, 0.16) 0%, rgba(249, 115, 22, 0.05) 32%, transparent 62%),
            radial-gradient(circle at 16% 82%, rgba(5, 150, 105, 0.12) 0%, transparent 54%)
          `,
          backgroundSize: '36px 36px, 36px 36px, 100% 100%, 100% 100%',
        }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  )
}
