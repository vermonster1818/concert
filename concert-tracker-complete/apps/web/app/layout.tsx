import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="max-w-3xl mx-auto p-4">
        <nav className="flex flex-wrap gap-3 mb-6 text-sm">
          <Link href="/">Upcoming</Link>
          <Link href="/add">Add</Link>
          <Link href="/history">History</Link>
          <Link href="/stats">Stats</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/import">Import</Link>
          <Link href="/signin">Sign in</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
