"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { showToast } from "./toast"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [slackWebhook, setSlackWebhook] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (isOpen) {
      const savedSlackWebhook = localStorage.getItem("micro.slackWebhook") || ""
      const savedEmail = localStorage.getItem("micro.email") || ""
      setSlackWebhook(savedSlackWebhook)
      setEmail(savedEmail)
    }
  }, [isOpen])

  const handleSave = () => {
    localStorage.setItem("micro.slackWebhook", slackWebhook)
    localStorage.setItem("micro.email", email)
    showToast("✅ Settings saved")
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-md border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent transition-colors"
            aria-label="Close settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="slack-webhook" className="block text-sm font-medium text-foreground mb-2">
              Slack Webhook URL
            </label>
            <input
              id="slack-webhook"
              type="url"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-input rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
