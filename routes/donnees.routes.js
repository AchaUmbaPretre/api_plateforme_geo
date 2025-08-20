const express = require('express');
const { listDonnees, listDonneesOne, listDonneesOneType, addDonnees } = require('../controllers/donnees.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, listDonnees);
router.get('/one', authenticateToken, listDonneesOne);
router.get('/oneType', authenticateToken, listDonneesOneType);
router.post('/', authenticateToken, authorizeRoles("admin"), addDonnees)

module.exports = router;