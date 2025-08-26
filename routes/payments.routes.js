const express = require('express')
const { initiatePayment, maxiCashCallback, listPayment } = require('../controllers/payments.controller.js');

const router = express.Router();

router.get('/', listPayment)

//Initier un paiement
router.post("/initiate", initiatePayment);

//MaxiCash
router.post("/callback", maxiCashCallback);

module.exports = router;
