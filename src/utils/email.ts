import { createTransport } from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  content: string
) => {
  // Define Nodemailer Transporter
  const transporter = createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_SENDER_PASS,
    },
  });

  // Define email
  const mailOptions = {
    from: "Sonarly",
    to: email,
    subject,
    html: content,
  };

  // Send email
  return await transporter.sendMail(mailOptions);
};
