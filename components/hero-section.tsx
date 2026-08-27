'use client'

import Image from 'next/image'
import { GraduationCap, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* soft playful backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-10 size-72 rounded-full bg-sky/40 blur-3xl" />
        <div className="absolute -right-20 top-40 size-80 rounded-full bg-accent/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-leaf/30 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:py-24">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-bold text-primary shadow-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            AI-powered • Made for kids
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            Meet{' '}
            <span className="text-primary">MozhiLearn</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md font-semibold text-lg text-muted-foreground text-pretty md:mx-0">
            AI-Powered Mother Tongue Learning for Primary Students
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row md:justify-start">
            <Button
              size="lg"
              className="h-14 rounded-2xl px-8 text-base font-extrabold shadow-md"
            >
              <GraduationCap className="size-5" aria-hidden="true" />
              I&apos;m a Teacher
            </Button>
            <Button
              size="lg"
              className="h-14 rounded-2xl bg-secondary px-8 text-base font-extrabold text-secondary-foreground shadow-md hover:bg-secondary/80"
            >
              <User className="size-5" aria-hidden="true" />
              I&apos;m a Student
            </Button>
          </div>

          <p className="mt-5 text-sm font-semibold text-muted-foreground">
            Trusted by 500+ classrooms across Tamil Nadu 🎒
          </p>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border-4 border-card bg-card p-3 shadow-xl">
            <Image
              src="/hero-kids.png"
              alt="Primary students learning Tamil with a friendly AI robot tutor"
              width={720}
              height={720}
              priority
              className="h-auto w-full rounded-[1.5rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
