import type React from "react"
import type { Metadata } from "next"
import { ClientLayout } from "./client-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Micro-Milestone Celebrator",
  description: "Celebrate your small wins with confetti and Slack notifications",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
