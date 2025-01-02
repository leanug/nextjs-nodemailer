import { NextResponse } from "next/server"
import { z } from 'zod'

import nodemailer from "nodemailer"

type RequestData = {
  email: string
  message: string
  name: string
}

// Define Zod schema for validation
const RequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
})

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, message: "Method Not Allowed" }, 
      { status: 405 }
    )
  }

  const data: RequestData = await req.json()
  const { email, message, name } = RequestSchema.parse(data)

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
      subject: `New message from ${name}`,
      text: message,
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