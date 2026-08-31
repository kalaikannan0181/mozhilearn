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
  title: {
    default: "MozhiLearn | Learning in Every Child's Mother Tongue",
    template: '%s | MozhiLearn',
  },
  description:
    'MozhiLearn is a mother tongue-based learning platform for Indian primary schools. Teacher-guided Tamil lesson workflow, audio narration, and quiz-based comprehension checks for Grades 1–5.',
  keywords: [
    'mother tongue learning',
    'Tamil education',
    'NEP 2020',
    'primary education India',
    'SIH 2026',
    'vernacular pedagogy',
  ],
  openGraph: {
    title: 'MozhiLearn — Learning in Every Child\'s Mother Tongue',
    description:
      'Teacher-guided Tamil lesson workflow, audio narration, and quiz-based comprehension checks for Indian primary schools.',
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
