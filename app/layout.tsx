import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'


export const metadata: Metadata = {
  title: {
    default: "MozhiLearn | AI-Powered Mother-Tongue Learning for Tribal Children",
    template: '%s | MozhiLearn',
  },
  description:
    'MozhiLearn is an AI-powered vernacular pedagogy platform for Jharkhand tribal primary schools. Hindi → Santhali / Ho / Mundari lesson translation, audio narration, and quiz-based learning for Grades 1–5. SIH26042.',
  keywords: [
    'mother tongue learning',
    'tribal language education',
    'Santhali education',
    'Jharkhand primary school',
    'vernacular pedagogy',
    'NEP 2020',
    'NIPUN Bharat',
    'Hindi to Santhali',
    'SIH 2026',
    'SIH26042',
  ],
  openGraph: {
    title: 'MozhiLearn — AI-Powered Mother-Tongue Learning for Tribal Children',
    description:
      'Hindi → Santhali / Ho / Mundari lesson translation with AI-powered pedagogical simplification, audio narration, and offline learning for primary schools in Jharkhand.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1D4ED8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" translate="no" className="light bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
