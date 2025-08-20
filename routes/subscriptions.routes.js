const express = require('express');
const { listSubscriptions, listSubscriptionsOne, addSubscription } = require('../controllers/subscriptions.controller');

const router = express.Router();

router.get('/', listSubscriptions);
router.get('/one', listSubscriptionsOne);
router.post('/', addSubscription)

module.exports = router;