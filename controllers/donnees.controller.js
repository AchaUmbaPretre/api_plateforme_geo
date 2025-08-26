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
 const addDonnees = async (req, res) => {
  try {
    const {
      id_type,
      titre,
      description,
      pays,
      region,
      latitude,
      longitude,
      meta,
      date_collecte,
      acces,
    } = req.body;

    // Récupération des fichiers uploadés par multer
    const fichier = req.files?.fichier ? req.files.fichier[0].filename : null;
    const vignette = req.files?.vignette ? req.files.vignette[0].filename : null;

    // Construction des URL publiques
    const fichier_url = fichier ? `/uploads/${fichier}` : null;
    const vignette_url = vignette ? `/uploads/${vignette}` : null;

    // Appel du modèle
    const newDonnee = await donneesModel.createDonnees({
      id_type,
      titre,
      description,
      pays,
      region,
      latitude,
      longitude,
      fichier_url,
      vignette_url,
      meta,
      date_collecte,
      acces,
    });

    res.status(201).json({
      message: "Donnée ajoutée avec succès",
      donnee: newDonnee,
    });
  } catch (error) {
    console.error("Erreur addDonnees:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout de la donnée" });
  }
};

module.exports = { listDonnees, listDonneesOne, addDonnees };
