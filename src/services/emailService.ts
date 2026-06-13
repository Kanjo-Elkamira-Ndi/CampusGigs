import { Resend } from 'resend'
import { env } from '../config/env'

const resend = new Resend(env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string): Promise<void> {
  const link = `${env.FRONTEND_URL}/account?identifier=${encodeURIComponent(email)}`

  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Verify your email — CampusGigs',
      html: `<p>Click <a href="${link}">here</a> to verify your email address.</p>`,
    })
  } catch (err) {
    console.error('Failed to send verification email:', err)
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const link = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`

  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Reset your password — CampusGigs',
      html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    })
  } catch (err) {
    console.error('Failed to send password reset email:', err)
  }
}
