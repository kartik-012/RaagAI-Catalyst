import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { passwordResetEmail } from "@/lib/emailTemplates"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Generate a mock reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetLink = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    const result = await sendEmail({
      to: email,
      subject: "Reset Your Password — RagaAI Catalyst",
      html: passwordResetEmail(resetLink),
    })

    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
      messageId: result.messageId,
      previewUrl: result.previewUrl, // Ethereal preview link (null for real SMTP)
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    )
  }
}
