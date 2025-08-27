import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const finalWebhookUrl = webhookUrl || process.env.SLACK_WEBHOOK_URL

    if (!finalWebhookUrl) {
      console.warn("No Slack webhook URL provided in request or environment")
      return NextResponse.json({ message: "Slack notification skipped - webhook not configured" }, { status: 200 })
    }

    const response = await fetch(finalWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status}`)
    }

    return NextResponse.json({ message: "Slack notification sent successfully" })
  } catch (error) {
    console.error("Failed to send Slack notification:", error)
    return NextResponse.json({ error: "Failed to send Slack notification" }, { status: 500 })
  }
}
