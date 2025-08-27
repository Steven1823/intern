import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const webhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn("SLACK_WEBHOOK_URL not configured")
      return NextResponse.json({ message: "Notification skipped - webhook not configured" }, { status: 200 })
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status}`)
    }

    return NextResponse.json({ message: "Notification sent successfully" })
  } catch (error) {
    console.error("Failed to send Slack notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
