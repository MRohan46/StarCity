import express from "express";
import { createPayment, deletePendingPayment, getPendingPayment, handleWebhook } from "../controllers/paymentController.js";
import userAuth from "../middleware/userAuth.js";


const paymentRouter = express.Router();

paymentRouter.post('/create', userAuth, createPayment);
paymentRouter.post('/webhook', handleWebhook);
paymentRouter.get('/pending', userAuth, getPendingPayment);
paymentRouter.post('/delete', userAuth, deletePendingPayment);

export default paymentRouter;
