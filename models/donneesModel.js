const pool = require('../config/db')

const getDonnees = async() => {
    const [rows] = await pool.query('SELECT * FROM donnees');
    return rows
}

const getDonneesOne = async(id) => {
    const [rows] = await pool.query('SELECT * FROM donnees WHERE id_donnee = ?');
    [id]
    return rows
}

const getDonneesTypeOne = async(id) => {
    const [rows] = await pool.query('SELECT * FROM donnees WHERE id_type = ?');
    [id]
    return rows
}

const createDonnees = async (data) => {
    const { id_type, titre, description, pays, region, latitude, longitude, fichier_url, vignette_url, meta, date_collecte, acces } = data;
    const [result] = await pool.query(
        "INSERT INTO donnees (id_type, titre, description, pays, region, latitude, longitude, fichier_url, vignette_url, meta, date_collecte, acces)",
        [id_type, titre, description, pays, region, latitude, longitude, fichier_url, vignette_url, meta, date_collecte, acces]
    );
    return { id: result.insertId, ...data};
}

module.exports = { getDonnees, getDonneesOne, getDonneesTypeOne, createDonnees };