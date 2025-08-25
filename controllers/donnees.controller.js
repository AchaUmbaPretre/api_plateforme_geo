const donneesModel = require('./../models/donneesModel');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // pour créer la vignette

// GET /donnees avec filtres avancés
const listDonnees = async (req, res, next) => {
  try {
    const filters = req.query;
    const donnees = await donneesModel.getDonnees(filters);
    res.json(donnees);
  } catch (error) {
    next(error);
  }
}

// GET /donnees/one?id_donnee=...
const listDonneesOne = async (req, res, next) => {
  try {
    const { id_donnee } = req.query;
    if (!id_donnee) return res.status(400).json({ message: 'id_donnee requis' });

    const donnee = await donneesModel.getDonneesOne(id_donnee);
    if (!donnee) return res.status(404).json({ message: 'Donnée non trouvée' });

    res.json(donnee);
  } catch (error) {
    next(error);
  }
}

// POST /donnees (admin) avec upload
const addDonnees = async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      const uploadPath = `/uploads/${req.file.filename}`;
      data.fichier_url = uploadPath;

      // Création d’une vignette automatique si c’est une image
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const thumbName = `thumb_${req.file.filename}`;
        const thumbPath = path.join('public/uploads', thumbName);
        await sharp(req.file.path).resize(200, 200).toFile(thumbPath);
        data.vignette_url = `/uploads/${thumbName}`;
      }
    }

    const newDonnees = await donneesModel.createDonnees(data);
    res.status(201).json(newDonnees);
  } catch (error) {
    next(error);
  }
}

module.exports = { listDonnees, listDonneesOne, addDonnees };
