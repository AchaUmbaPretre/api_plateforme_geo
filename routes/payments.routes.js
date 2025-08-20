const express = require('express');
const { listPayment, listPaymentOne, addPayments } = require('../controllers/payments.controller');

const router = express.Router();

router.get('/', listPayment);
router.get('/one', listPaymentOne);
router.post('/', addPayments)

module.exports = router;