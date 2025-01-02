import MailForm from "@/components/Forms/MailForm";
import nodemailer from "nodemailer";
import mailFormSchema from "@/utils/validation/mail-form";
import { FormData } from "@/types/form-data";
import { getErrorMessage } from "@/utils/error";

export default async function Home() {
  const sendMail = async (formData: FormData) => {
    'use server'
  
    try {
      //throw new Error('Generic error Not implemented');
      //throw 'Cool error'
      // Validate the data
      mailFormSchema.parse(formData);
  
      // Nodemailer setup
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: formData.email,
        to: process.env.MAIL_RECEIVER_ADDRESS,
        subject: formData.subject,
        text: formData.message,
        html: '',
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
  };

  return (
    <MailForm sendMail={sendMail} />
  );
}
