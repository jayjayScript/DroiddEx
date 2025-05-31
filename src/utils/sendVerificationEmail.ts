import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DroidEx" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family:sans-serif;">
        <h2>Email Verification</h2>
        <p>Your 6-digit code is:</p>
        <h1>${code}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
