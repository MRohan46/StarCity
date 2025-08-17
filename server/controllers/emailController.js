// controllers/emailController.js
import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { fullName, email, subject, message } = req.body || {};

  // Basic validation
  if (
    typeof fullName !== "string" || !fullName.trim() ||
    typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof subject !== "string" || !subject.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    // Configure transport (use your real SMTP creds from .env)
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",     // e.g. "smtp.gmail.com"
      port: 587,     // e.g. 465
      secure: false,                    // true if using 465
      auth: {
        user: "support@starcityrp.com",   // e.g. "support@starcityrp.com"
        pass: process.env.SUPPORT_STARCITY,   // app password or SMTP password
      },
    });

    const mailOptions = {
      from: `"support" <support@starcityrp.com>`,
      to: `"business" <business@starcityrp.com>`,
      subject,
      text: message,   // plain text
      html: `<p>${message}</p>
             <hr/>
             <p><b>From:</b> ${fullName} (${email})</p>`, // optional: include sender
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Email sent successfully." });
  } catch (emailErr) {
    console.error("Email send failed:", emailErr);
    return res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
