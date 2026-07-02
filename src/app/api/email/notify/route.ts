import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { notificationEmail } from "@/lib/emailTemplates"

export async function POST(req: NextRequest) {
  try {
    const { to, subject, title, message, actionUrl } = await req.json()

    if (!to || !subject || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, title, message" },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to,
      subject,
      html: notificationEmail(title, message, actionUrl),
    })

    return NextResponse.json({
      success: true,
      message: "Notification email sent",
      messageId: result.messageId,
      previewUrl: result.previewUrl,
    })
  } catch (error: any) {
    console.error("Notification email error:", error)
    return NextResponse.json(
      { error: "Failed to send notification", details: error.message },
      { status: 500 }
    )
  }
}
