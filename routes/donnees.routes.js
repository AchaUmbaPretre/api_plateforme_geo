const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { listDonnees, listDonneesOne, addDonnees, listDonneesType } = require('../controllers/donnees.controller');

// Config Multer (stockage local exemple)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // __dirname correspond au dossier actuel du fichier JS
    cb(null, path.join(__dirname, "..", "public", "uploads")); 
    // ".." pour remonter un dossier si tu es dans routes/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

const upload = multer({ storage });

router.get('/', listDonnees);
router.get('/one', listDonneesOne);
router.get('/type_one', listDonneesType);

router.post(
  "/",
  upload.fields([
    { name: "fichier", maxCount: 1 },
    { name: "vignette", maxCount: 1 },
  ]),
  addDonnees
);

module.exports = router;
