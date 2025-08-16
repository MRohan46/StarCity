import nodemailer from "nodemailer"
import "dotenv/config";
// Replace with your real credentials
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 587, // Use 465 if using secure: true
  secure: false, // true for port 465, false for 587
  auth: {
    user: 'noreply@starcityrp.com', // your email
    pass: process.env.NOREPLY_STARCITY,     // your password
  },
});

export default transporter;