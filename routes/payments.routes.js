import express from "express";
import { initiatePayment, maxiCashCallback } from "../controllers/paymentController.js";

const router = express.Router();

//Initier un paiement
router.post("/initiate", initiatePayment);

//MaxiCash
router.post("/callback", maxiCashCallback);

export default router;
