import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  href?: string
  showText?: boolean
  subtext?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  textClassName?: string
  priority?: boolean
}

export function MozhiLogo({
  href,
  showText = true,
  subtext,
  size = 'md',
  className = '',
  textClassName = '',
  priority = true,
}: LogoProps) {
  const sizeMap = {
    sm: { width: 32, height: 32, text: 'text-base' },
    md: { width: 40, height: 40, text: 'text-lg' },
    lg: { width: 48, height: 48, text: 'text-xl' },
  }

  const currentSize = sizeMap[size]

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/icon.png"
          alt="MozhiLearn Logo Icon"
          width={currentSize.width}
          height={currentSize.height}
          className="object-contain"
          priority={priority}
        />
      </div>
      {showText && (
        <div className={`flex flex-col leading-none ${textClassName}`}>
          <span className={`font-display font-extrabold tracking-tight text-foreground ${currentSize.text}`}>
            MozhiLearn
          </span>
          {subtext && (
            <span className="text-[11px] font-medium text-muted-foreground mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 transition-opacity hover:opacity-90 inline-flex items-center"
      >
        {content}
      </Link>
    )
  }

  return content
}
