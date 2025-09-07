const express = require('express');
const { listUser, listUserOne, listUserStat, countUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', listUser);
router.get('/count', countUser);
router.get('/one', listUserOne);
router.get('/stat', listUserStat);


module.exports = router;