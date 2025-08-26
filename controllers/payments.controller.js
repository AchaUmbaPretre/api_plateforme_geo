const axios = require("axios");
const { createPayment, updatePayment, extendUserSubscription, getPayment } = require("../models/paymentsModel");

require("dotenv").config(); // Charger les variables .env

const listPayment = async(req, res) => {
try {
    const types = await getPayment();
    res.json(types);
  } catch (error) {
    next(error); // 👉 passe au middleware errorHandler
  }
}

// INITIATION DU PAIEMENT
const initiatePayment = async (req, res) => {
  const { userId, subscriptionId, amount, phone } = req.body;

  try {
    // 1️⃣ Créer un enregistrement pending
    const paymentId = await createPayment({ userId, subscriptionId, amount, method: "maxicash" });

    // 2️⃣ Appel API MaxiCash Sandbox
    const response = await axios.post("https://sandbox.maxicashapp.com/payments", {
      amount,
      currency: "USD",
      msisdn: phone || process.env.MAXICASH_PHONE,
      narrative: "Achat abonnement",
      partnerCode: process.env.MAXICASH_PARTNER_CODE,
      secretKey: process.env.MAXICASH_SECRET,
      externalId: paymentId,
    });

    // 3️⃣ Mettre à jour la transaction
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

// CALLBACK MaxiCash (notification)
const maxiCashCallback = async (req, res) => {
  const { externalId, status, transactionId, userId, subscriptionId } = req.body;

  try {
    // 1️⃣ Mettre à jour le paiement
    await updatePayment(externalId, {
      transactionId,
      status,
      metadata: req.body
    });

    // 2️⃣ Si succès → étendre l’abonnement utilisateur
    if (status === "success") {
      await extendUserSubscription(userId, subscriptionId);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("Erreur callback MaxiCash:", err.message);
    res.status(500).send("Erreur callback");
  }
};

module.exports = { listPayment, initiatePayment, maxiCashCallback };
