import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Micro-Milestone Celebrator",
  description: "Celebrate your small wins with confetti and Slack notifications",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}>
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <h1 className="text-2xl font-bold text-center">🎉 Micro-Milestone Celebrator</h1>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">{children}</main>

        <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-400">v1.0.0</p>
        </footer>
      </body>
    </html>
  )
}
