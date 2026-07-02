import nodemailer from "nodemailer"

let cachedTransporter: nodemailer.Transporter | null = null

export async function getTransporter() {
  if (cachedTransporter) return cachedTransporter

  // If SMTP_HOST is configured, use it (Gmail, SendGrid, etc.)
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    return cachedTransporter
  }

  // Fallback: Create Ethereal test account (emails viewable at ethereal.email)
  const testAccount = await nodemailer.createTestAccount()
  cachedTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
  console.log("📧 Ethereal test account created:", testAccount.user)
  return cachedTransporter
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const transporter = await getTransporter()
  const from = process.env.SMTP_FROM || "noreply@ragaai.dev"

  const info = await transporter.sendMail({
    from: `"RagaAI Catalyst" <${from}>`,
    to,
    subject,
    html,
  })

  // For Ethereal, log the preview URL
  const previewUrl = nodemailer.getTestMessageUrl(info)
  if (previewUrl) {
    console.log("📧 Preview URL:", previewUrl)
  }

  return {
    messageId: info.messageId,
    previewUrl: previewUrl || null,
  }
}
