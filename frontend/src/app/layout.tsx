import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BlockExplorer - Blockchain Explorer & Wallet',
  description: 'High-performance exploration and non-custodial wallet solutions for the decentralized web',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Material Symbols already imported in globals.css */}
      </head>
      <body className="bg-background-dark text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
