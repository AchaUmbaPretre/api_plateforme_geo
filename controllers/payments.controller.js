const axios = require("axios");
const { createPayment, updatePayment, extendUserSubscription, getPayment, getPaymentStat, getPaymentCount } = require("../models/paymentsModel");
require("dotenv").config();
const qs = require("qs");
const express = require("express");

// ---------------- LISTE DES PAIEMENTS ----------------
const listPayment = async (req, res, next) => {
  try {
    const types = await getPayment();
    res.json(types);
  } catch (error) {
    next(error);
  }
};

const countPayment = async (req, res, next) => {
  try {
    const count = await getPaymentCount();
    res.json(count);
  } catch (error) {
    next(error);
  }
};

const listPaymentStat = async (req, res, next) => {
  try {
    const stat = await getPaymentStat();
    res.json(stat);
  } catch (error) {
    next(error);
  }
};

// ---------------- INITIATION DU PAIEMENT ----------------
const initiatePayment = async (req, res) => {
  const { userId, subscriptionId, amount, phone, email } = req.body;

  if (!amount || parseFloat(amount) < 5) {
    return res.status(400).json({ error: "Le montant minimum est 5 USD." });
  }

  try {
    // Crée le paiement dans la DB
    const paymentId = await createPayment({
      userId,
      subscriptionId,
      amount,
      method: "maxicash",
    });

    // URL publique Ngrok - à remplacer par ton URL actuel
    const NGROK_URL = process.env.NGROK_URL || "https://xyz1234.ngrok.io";

    // Prépare le payload pour MaxiCash PayEntry
    const payload = {
      PayType: "MaxiCash",
      Amount: parseFloat(amount).toFixed(2),
      Currency: "maxiDollar",
      Telephone: phone,
      MerchantID: process.env.MAXICASH_PARTNER_CODE,
      MerchantPassword: process.env.MAXICASH_SECRET,
      Language: "fr",
      Reference: paymentId.toString(),
      Accepturl: `${NGROK_URL}/payment-success`,
      Cancelurl: `${NGROK_URL}/pay-cancel`,
      Declineurl: `${NGROK_URL}/pay-failure`,
      NotifyURL: `${NGROK_URL}/api/payment/callback`,
      Email: email || "test@test.com",
    };

    // Renvoie l'URL de redirection et les données pour POST form côté frontend
    res.json({
      redirectUrl: "https://api-testbed.maxicashme.com/PayEntryPost",
      formData: payload,
    });
  } catch (err) {
    console.error("Erreur initiation paiement:", err);
    res.status(500).json({ error: "Erreur lors de l'initiation du paiement." });
  }
};

// ---------------- CALLBACK MaxiCash ----------------
const maxiCashCallback = async (req, res) => {
  // Selon MaxiCash, le callback peut envoyer x-www-form-urlencoded
  // Assure-toi d'avoir dans ton app.js/serveur : app.use(express.urlencoded({ extended: true }));
  console.log("Callback MaxiCash reçu :", req.body);

  const { Reference, Status, TransactionID, TransactionId, transaction_id, userId, subscriptionId } = req.body;

  // Utilise le champ correct renvoyé par MaxiCash
  const realTransactionId = TransactionID || TransactionId || transaction_id || null;

  console.log("Callback MaxiCash reçu :", req.body);

  try {
    // Mets à jour le paiement dans la DB
    await updatePayment(Reference, {
      transactionId: realTransactionId,
      status: Status,
      metadata: req.body,
    });

    // Si paiement réussi, prolonge l'abonnement
    if (Status === "success") {
      await extendUserSubscription(userId, subscriptionId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur callback MaxiCash:", err.message);
    res.status(500).send("Erreur callback");
  }
};

module.exports = { listPayment, countPayment, listPaymentStat, initiatePayment, maxiCashCallback };
