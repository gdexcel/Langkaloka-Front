//langkaloka-v1\lib\mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"LangkaLoka" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT:", info.messageId);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    throw error;
  }
};
