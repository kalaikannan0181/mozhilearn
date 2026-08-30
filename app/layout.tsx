import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Tamil, Poppins } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], display: 'swap' })
const _poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
})
const _notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MozhiLearn — Every Child Deserves to Learn in Their Mother Tongue',
  description:
    'MozhiLearn is an AI-powered mother tongue learning platform for Indian primary schools. Instant English to Tamil lesson translation, pedagogy adaptation for Grades 1-5, natural Tamil audio narration and real-time progress analytics for teachers.',
  keywords: [
    'mother tongue learning',
    'Tamil education',
    'NEP 2020',
    'AI translation for schools',
    'primary education India',
    'SIH 2026',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'MozhiLearn — Learning in Mother Tongue',
    description:
      'AI-powered translation and pedagogy adaptation for Indian primary education. Free for government schools.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2563EB',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
