import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json()

    if (!to || !subject || !text) {
      return NextResponse.json({ error: "to, subject, and text are required" }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM

    if (!resendApiKey || !emailFrom) {
      console.warn("RESEND_API_KEY or EMAIL_FROM not configured")
      return NextResponse.json({ message: "Email skipped - configuration missing" }, { status: 200 })
    }

    const resend = new Resend(resendApiKey)

    const response = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      text,
    })

    if (response.error) {
      throw new Error(`Resend API error: ${response.error.message}`)
    }

    return NextResponse.json({ message: "Email sent successfully", id: response.data?.id })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
