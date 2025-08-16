import express from "express";
import cors from "cors"
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import bodyParser from 'body-parser'
import paymentRoutes from "./routes/paymentRoutes.js";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect To MongoDB
connectDB();
app.use(helmet())
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://www.starcityrp.com",
    credentials: true
}));

app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => console.log(`Server Started on PORT: ${PORT}`));
