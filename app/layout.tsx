import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ADHD Focus - Focus Timer | 专注计时器',
  description: 'A calming focus timer designed for ADHD individuals with immersive forest backgrounds and customizable timers to enhance concentration and productivity. 专为ADHD人群设计的专注力训练工具，提供沉浸式森林背景和定时功能，帮助提高专注力和工作效率。',
  keywords: [
    'ADHD', 'focus', 'timer', 'concentration', 'productivity', 'pomodoro', 'meditation', 'forest', 'background',
    '专注', '计时器', '专注力训练', '番茄工作法', '冥想', '专注力', '森林', '背景音乐'
  ],
  authors: [{ name: 'ADHD Focus' }],
  openGraph: {
    title: 'ADHD Focus - Focus Timer | 专注计时器',
    description: 'A calming focus timer for ADHD individuals with forest backgrounds. 专为ADHD人群设计的专注力训练工具。',
    url: 'https://www.adhd-focus.ailula.top',
    siteName: 'ADHD Focus',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'ADHD Focus Timer Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADHD Focus - Focus Timer | 专注计时器',
    description: 'A calming focus timer for ADHD individuals. 专为ADHD人群设计的专注力训练工具。',
    images: ['/preview.png'],
  },
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
        <meta name="description" content="A calming focus timer for ADHD individuals with forest backgrounds. 专为ADHD人群设计的沉浸式森林背景专注计时器。" />
        <meta property="og:title" content="ADHD Focus - Focus Timer | 专注计时器" />
        <meta property="og:description" content="A calming focus timer for ADHD individuals with forest backgrounds. 专为ADHD人群设计的专注力训练工具。" />
        <meta property="og:image" content="/preview.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ADHD Focus - Focus Timer",
              "description": "A calming focus timer designed for ADHD individuals with immersive forest backgrounds",
              "url": "https://www.adhd-focus.ailula.top",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "ADHD Focus"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-9S9MN48V0H" />
      </body>
    </html>
  )
} 