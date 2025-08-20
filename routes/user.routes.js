const express = require('express');
const { listUser, listUserOne } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', listUser);
router.get('/one', listUserOne);

module.exports = router;