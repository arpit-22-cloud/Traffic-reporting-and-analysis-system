import handleAsyncError from "../models/handleAsyncError.js";
import nodemailer from 'nodemailer'
export const sendEmail = handleAsyncError(async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:`${process.env.SMTP_MAIL}`,
      pass:`${process.env.SMTP_PASSWORD}`
    }
    
  })
  const mailOptions={
    from:`${process.env.SMTP_MAIL}`,
    to:options.email,
    subject:options.subject,
    text:options.message,

  }
await transporter.sendMail(mailOptions);
})