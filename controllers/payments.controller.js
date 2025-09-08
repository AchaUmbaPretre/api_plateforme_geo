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

const initiatePayment = async (req, res) => {
  const { userId, subscriptionId, amount, phone, email } = req.body;

  if (!amount || parseFloat(amount) < 5) {
    return res.status(400).json({ error: "Le montant minimum est 5 USD." });
  }

  try {
    // 1️⃣ Sauvegarde paiement DB
    const paymentId = await createPayment({
      userId,
      subscriptionId,
      amount,
      method: "maxicash",
    });

    // 2️⃣ Prépare URL de redirection
    const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";
    const FRONTEND_URL =
      process.env.DOMAIN_FRONTEND || "http://localhost:3000";

    // 3️⃣ Payload PayEntry
    const payload = {
      PayType: "MaxiCash",
      Amount: parseFloat(amount).toFixed(2),
      Currency: "maxiDollar",
      Telephone: phone,
      MerchantID: process.env.MAXICASH_PARTNER_CODE,
      MerchantPassword: process.env.MAXICASH_SECRET,
      Language: "fr",
      Reference: paymentId.toString(),
      Accepturl: `${FRONTEND_URL}/payment-success`,
      Cancelurl: `${FRONTEND_URL}/payment-cancel`,
      Declineurl: `${FRONTEND_URL}/payment-failure`,
      NotifyURL: `${BACKEND_URL}/api/payment/callback`,
      Email: email || "test@test.com",
    };

    res.json({
      redirectUrl: "https://api-testbed.maxicashme.com/PayEntryPost",
      formData: payload,
    });
  } catch (err) {
    console.error("Erreur initiation paiement:", err);
    res.status(500).json({ error: "Erreur lors de l'initiation du paiement." });
  }
};

// ---------------- CALLBACK ----------------
const maxiCashCallback = async (req, res) => {
  console.log("Callback MaxiCash reçu :", req.body);

  const { Reference, Status, TransactionID, userId, subscriptionId } = req.body;

  try {
    await updatePayment(Reference, {
      transactionId: TransactionID,
      status: Status,
      metadata: req.body,
    });

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
