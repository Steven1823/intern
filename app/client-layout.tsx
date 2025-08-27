"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsModal } from "@/components/settings-modal"
import { ToastContainer } from "@/components/toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Micro-Milestone Celebrator</title>
        <meta name="description" content="Celebrate your small wins with confetti and Slack notifications" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <header className="bg-card/95 backdrop-blur-sm border-b border-border/50 p-4 sticky top-0 z-40">
            <div className="container mx-auto max-w-4xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🎉</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Micro-Milestone Celebrator
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group"
                  aria-label="Open settings"
                >
                  <svg
                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">{children}</main>

          <footer className="bg-card/50 border-t border-border/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">v1.0.0 • Built with Next.js & Tailwind CSS</p>
          </footer>

          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default ClientLayout
