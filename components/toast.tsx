"use client"

import { useState, useEffect } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

let toastId = 0
const toastCallbacks: ((toast: Toast) => void)[] = []

export function showToast(message: string, type: "success" | "error" = "success") {
  const toast: Toast = {
    id: (++toastId).toString(),
    message,
    type,
  }
  toastCallbacks.forEach((callback) => callback(toast))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const callback = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 4000)
    }
    toastCallbacks.push(callback)
    return () => {
      const index = toastCallbacks.indexOf(callback)
      if (index > -1) toastCallbacks.splice(index, 1)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-right-full duration-300 ${
            toast.type === "success" ? "bg-green-600 border border-green-500" : "bg-red-600 border border-red-500"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  )
}
