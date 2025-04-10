import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ADHD Focus',
  description: 'A calming environment for ADHD focus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
        <meta name="theme-color" content="#4ADE80" />
        <meta name="description" content="A simple concentration timer for ADHD focus" />
        <meta property="og:title" content="ADHD Focus - Concentration Timer" />
        <meta property="og:description" content="A simple concentration timer for ADHD focus" />
        <meta property="og:image" content="/preview.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-WMC06JHFDG" />
      </body>
    </html>
  )
} 