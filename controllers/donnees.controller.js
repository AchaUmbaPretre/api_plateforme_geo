const donneesModel = require('./../models/donneesModel');

const listDonnees = async(req, res, next) => {
    try {
        const donnees = await donneesModel.getDonnees();
        res.json(donnees)
    } catch (error) {
        next(error)
    }
}

const listDonneesOne = async(req, res, next) => {
    const { id_donnee } = req.query;
    try {
        const donnees = await donneesModel.getDonneesOne(id_donnee);
        res.json(donnees)
    } catch (error) {
        next(error)
    }
}

const listDonneesOneType = async(req, res, next) => {
    const { id_type } = req.query;
    try {
        const donnees = await donneesModel.getDonneesTypeOne(id_type);
        res.json(donnees)
    } catch (error) {
        next(error)
    }
}

const addDonnees = async (req, res, next) => {
    try {
        const newDonnees = await donneesModel.createDonnees(req.body);
        res.status(201).json(newDonnees);
    } catch (error) {
        next(error);
    }
}

module.exports = { listDonnees, listDonneesOne, listDonneesOneType, addDonnees }