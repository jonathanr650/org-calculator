import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Organization Calculator',
  description: 'Calculate organizational structures and costs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
