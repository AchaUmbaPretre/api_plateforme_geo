const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { listDonnees, listDonneesOne, addDonnees } = require('../controllers/donnees.controller');

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', authenticateToken, listDonnees);
router.get('/one', authenticateToken, listDonneesOne);
router.post('/', upload.single('fichier'), addDonnees);

module.exports = router;
