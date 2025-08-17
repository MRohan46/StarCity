import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import emailRouter from "./routes/emailRoutes.js";
import helmet from "helmet";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect To MongoDB
connectDB();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Strict CORS (two origins only)
app.use(
  cors({
    origin: ["https://www.starcityrp.com", "https://mkmgaming.ltd"],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/email", emailRouter);

app.listen(PORT, () => console.log(`🚀 Server Started on PORT: ${PORT}`));
