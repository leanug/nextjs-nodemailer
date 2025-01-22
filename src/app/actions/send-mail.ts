'use server'

import { getErrorMessage } from "@/utils/error";
import mailFormSchema from "@/utils/validation/mail-form";
import nodemailer from "nodemailer";

export const sendMailAction = async (formData: FormData) => {

  /* console.log('Name:', name);
  console.log('Email:', email);
  console.log('Subject:', subject);
  console.log('Message:', message); */

  try {
    //throw new Error('Generic error Not implemented');
    //throw 'Cool error'
    // Validate the data
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    mailFormSchema.parse(data);

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: data.email as string,
      to: process.env.MAIL_RECEIVER_ADDRESS,
      subject: data.subject as string,
      text: data.message as string,
      html: `<p>${data.message}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return { 
      success: true,
      error: null,
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error) 
    };
  }
}