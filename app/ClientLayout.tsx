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

export default function ClientLayout({
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
          <header className="bg-card border-b border-border p-4">
            <div className="container mx-auto max-w-2xl flex items-center justify-between">
              <h1 className="text-2xl font-bold">🎉 Micro-Milestone Celebrator</h1>
              <div className="flex items-center gap-2">
                {/* <CHANGE> Connected settings button to modal state */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label="Open settings"
                >
                  <span className="w-5 h-5 block">⚙</span>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">{children}</main>

          <footer className="bg-card border-t border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">v1.0.0</p>
          </footer>

          {/* <CHANGE> Added settings modal and toast container */}
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
