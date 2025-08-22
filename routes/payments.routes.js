const express = require('express')
const { initiatePayment, maxiCashCallback } = require('../controllers/payments.controller.js')

const router = express.Router();

//Initier un paiement
router.post("/initiate", initiatePayment);

//MaxiCash
router.post("/callback", maxiCashCallback);

module.exports = router;
