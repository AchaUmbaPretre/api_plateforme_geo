import axios from "axios";
import { createPayment, updatePayment } from "../models/paymentModel.js";

export const initiatePayment = async (req, res) => {
  const { userId, subscriptionId, amount, method } = req.body;

  try {
    // 1. Créer un enregistrement pending
    const paymentId = await createPayment({ userId, subscriptionId, amount, method });

    // 2. Appel API MaxiCash
    const response = await axios.post("https://api.maxicashapp.com/payments", {
      amount,
      currency: "USD",
      msisdn: "243xxxxxxxxx", // numéro du client à remplacer dynamiquement
      narrative: "Achat abonnement",
      partnerCode: process.env.MAXICASH_PARTNER_CODE,
      secretKey: process.env.MAXICASH_SECRET,
      externalId: paymentId, // identifiant unique
    });

    // 3. Mise à jour du paiement en DB
    await updatePayment(paymentId, {
      transactionId: response.data.transactionId,
      status: "pending",
      metadata: response.data
    });

    res.json({ paymentId, redirectUrl: response.data.redirectUrl });
  } catch (err) {
    console.error("Erreur initiation paiement:", err.message);
    res.status(500).json({ error: "Erreur lors de l'initiation du paiement" });
  }
};

export const maxiCashCallback = async (req, res) => {
  const { externalId, status, transactionId } = req.body;

  try {
    await updatePayment(externalId, {
      transactionId,
      status,
      metadata: req.body
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur callback MaxiCash:", err.message);
    res.status(500).send("Erreur callback");
  }
};
