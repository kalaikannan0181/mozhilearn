'use client'

import { Clock, Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function DemoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="demo" className="bg-foreground py-16 lg:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            See It In Action
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-background sm:text-4xl">
            Watch a lesson travel from English to Tamil
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-background/70">
            A two-minute walkthrough of the teacher upload flow, AI adaptation
            and the student learning screen.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-4xl border border-background/15 bg-background/5 p-2 sm:p-3">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-foreground">
            {playing ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="font-display text-lg font-bold text-background">
                  Demo video coming soon
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-background/70">
                  The full product walkthrough is being recorded for SIH 2026.
                  Request early access and we&apos;ll send it to your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setPlaying(false)}
                  className="mt-2 inline-flex min-h-11 items-center rounded-xl border border-background/25 px-5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
                >
                  Back to preview
                </button>
              </div>
            ) : (
              <>
                <Image
                  src="/images/demo-thumbnail.png"
                  alt="Preview of the MozhiLearn product demo showing an English lesson being translated into Tamil"
                  fill
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-foreground/35"
                />
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 focus-visible:ring-3 focus-visible:ring-accent/50 focus-visible:outline-none"
                >
                  <span className="flex size-18 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl transition-transform hover:scale-110 sm:size-20">
                    <Play className="size-8 translate-x-0.5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-base font-semibold text-background">
                    Play product demo
                  </span>
                </button>
                <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-foreground/70 px-3 py-1.5 text-xs font-semibold text-background">
                  <Clock className="size-3.5" aria-hidden="true" />
                  2:14
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
