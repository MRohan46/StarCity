// routes/emailRoutes.js
import express from "express";
import { sendEmail } from "../controllers/emailController.js";

const router = express.Router();

// route will be: /api/email/<SECRET_PATH>
const SECRET_PATH = process.env.SECRET_EMAIL_PATH;

if (!SECRET_PATH) {
  console.error("❌ Missing SECRET_EMAIL_PATH in .env");
  process.exit(1);
}

router.post(`/${SECRET_PATH}`, sendEmail);

export default router;
