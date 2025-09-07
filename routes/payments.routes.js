const express = require('express')
const { initiatePayment, maxiCashCallback, listPayment, listPaymentStat, countPayment } = require('../controllers/payments.controller.js');

const router = express.Router();

router.get('/', listPayment);
router.get('/count', countPayment);
router.get('/stat', listPaymentStat);


//Initier un paiement
router.post("/initiate", initiatePayment);

//MaxiCash
router.post("/callback", maxiCashCallback);

module.exports = router;
