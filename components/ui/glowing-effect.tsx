'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlowingEffectProps {
  glowColor?: string
  glowSize?: number
  glowOpacity?: number
  disabled?: boolean
  className?: string
}

export function GlowingEffect({
  glowColor = '#1D4ED8',
  glowSize = 300,
  disabled = true,
  className,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (disabled) {
      setShouldAnimate(false)
      return
    }

    const mediaHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const checkGlowActivation = () => {
      const isFinePointer = mediaHover.matches
      const isReducedMotion = mediaReducedMotion.matches
      setShouldAnimate(isFinePointer && !isReducedMotion)
    }

    checkGlowActivation()

    mediaHover.addEventListener('change', checkGlowActivation)
    mediaReducedMotion.addEventListener('change', checkGlowActivation)

    return () => {
      mediaHover.removeEventListener('change', checkGlowActivation)
      mediaReducedMotion.removeEventListener('change', checkGlowActivation)
    }
  }, [disabled])

  useEffect(() => {
    if (!shouldAnimate) return

    const container = containerRef.current
    if (!container) return

    const parentCard = container.closest('article') || container.parentElement
    if (!parentCard) return

    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parentCard.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setCoords({ x, y })
      })
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setCoords(null)
    }

    parentCard.addEventListener('mousemove', handleMouseMove as EventListener)
    parentCard.addEventListener('mouseenter', handleMouseEnter)
    parentCard.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      parentCard.removeEventListener('mousemove', handleMouseMove as EventListener)
      parentCard.removeEventListener('mouseenter', handleMouseEnter)
      parentCard.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [shouldAnimate])

  if (disabled || !shouldAnimate) {
    return null
  }

  const { x, y } = coords || { x: 0, y: 0 }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
        isHovered && coords ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        background: `radial-gradient(${glowSize}px circle at ${x}px ${y}px, ${glowColor}, transparent 80%)`,
        WebkitMaskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
        maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
        WebkitMaskClip: 'content-box, padding-box',
        maskClip: 'content-box, padding-box',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: '1.5px', // Border width 1.5px
      }}
    />
  )
}
