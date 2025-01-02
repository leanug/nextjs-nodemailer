import { NextResponse } from "next/server"

import nodemailer from "nodemailer"

type RequestData = {
  email: string
  text: string
  name: string
  subject: string
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, message: "Method Not Allowed" }, 
      { status: 405 }
    )
  }

  const data: RequestData = await req.json()
  const { email, text, subject } = data

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: email,
      to: process.env.MAIL_RECEIVER_ADDRESS,
      subject: subject,
      text: text,
      html: ''
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      success: true,
    }, { 
      status: 200 
    })
  } catch(error) {
    console.error(error);
    return NextResponse.json({ 
      success: false,
    }, { 
      status: 400 
    })
  }
}