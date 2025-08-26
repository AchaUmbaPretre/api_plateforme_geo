const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { listDonnees, listDonneesOne, addDonnees } = require('../controllers/donnees.controller');

// Config Multer (stockage local exemple)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // dossier de stockage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
})
const upload = multer({ storage });

router.get('/', listDonnees);
router.get('/one', authenticateToken, listDonneesOne);
router.post(
  "/",
  upload.fields([
    { name: "fichier", maxCount: 1 },
    { name: "vignette", maxCount: 1 },
  ]),
  addDonnees
);

module.exports = router;
