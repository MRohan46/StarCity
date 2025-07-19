import express from "express";
import { createPayment, handleWebhook } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post('/create', createPayment);
paymentRouter.post('/webhook', handleWebhook);

export default paymentRouter;
