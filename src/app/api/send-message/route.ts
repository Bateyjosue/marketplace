import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const { to, subject, html } = await req.json()
  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  try {
    await resend.emails.send({
      from: 'Sandbox <onboarding@resend.dev>',
      to,
      subject,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Resend error', error)
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }
} 