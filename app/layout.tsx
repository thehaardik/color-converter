import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'cURL Converter - Convert cURL to Code',
  description: 'Convert cURL commands to Python, Node.js, Go, or Ruby instantly.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
