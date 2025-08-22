const axios = require("axios");
const { createPayment, updatePayment, extendUserSubscription } = require("../models/paymentsModel");

const initiatePayment = async (req, res) => {
  const { userId, subscriptionId, amount, method } = req.body;

  try {
    // 1. Créer un enregistrement pending
    const paymentId = await createPayment({ userId, subscriptionId, amount, method });

    // 2. Appel API MaxiCash
    const response = await axios.post("https://api.maxicashapp.com/payments", {
      amount,
      currency: "USD",
      msisdn: "243xxxxxxxxx", // ⚡ à remplacer dynamiquement par req.body.phone si dispo
      narrative: "Achat abonnement",
      partnerCode: process.env.MAXICASH_PARTNER_CODE,
      secretKey: process.env.MAXICASH_SECRET,
      externalId: paymentId,
    });

    // 3. Sauvegarder transaction_id
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

const maxiCashCallback = async (req, res) => {
  const { externalId, status, transactionId, userId, subscriptionId } = req.body;

  try {
    // 1. Mettre à jour le paiement
    await updatePayment(externalId, {
      transactionId,
      status,
      metadata: req.body
    });

    // 2. Si succès → étendre l’abonnement utilisateur
    if (status === "success") {
      await extendUserSubscription(userId, subscriptionId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur callback MaxiCash:", err.message);
    res.status(500).send("Erreur callback");
  }
};

module.exports = { initiatePayment, maxiCashCallback };
