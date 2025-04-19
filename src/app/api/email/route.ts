import { transport } from "@/service/nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, subject, text } = await req.json();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      text,
    };

    await transport.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        message: "Failed to send email",
      },
      { status: 500 }
    );
  }
}
