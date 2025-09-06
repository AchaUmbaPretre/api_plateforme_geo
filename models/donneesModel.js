const pool = require('../config/db');

const getDonnees = async (filters = {}) => {
  const { typeIds, pays, region, acces, dateCollecte, datePublication } = filters;
  let query = `SELECT d.id_donnee, d.titre, td.nom_type, p.nom_pays, pr.name_fr, d.description, d.latitude, d.longitude, d.fichier_url, d.vignette_url, d.date_collecte, d.date_publication, d.acces FROM donnees d 
                INNER JOIN types_donnees td ON td.id_type = d.id_type
                INNER JOIN pays p ON p.id_pays = d.pays
                INNER JOIN provinces pr ON pr.id = d.pays
                WHERE 1=1
              `;
  const params = [];

  if (typeIds && typeIds.length) {
    query += ` AND id_type IN (${typeIds.map(() => '?').join(',')})`;
    params.push(...typeIds);
  }
  if (pays) {
    query += ' AND pays LIKE ?';
    params.push(`%${pays}%`);
  }
  if (region) {
    query += ' AND region LIKE ?';
    params.push(`%${region}%`);
  }
  if (acces) {
    query += ' AND acces = ?';
    params.push(acces);
  }
  if (dateCollecte) {
    query += ' AND date_collecte = ?';
    params.push(dateCollecte);
  }
  if (datePublication) {
    query += ' AND DATE(date_publication) = ?';
    params.push(datePublication);
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

const getDonneesOne = async (id_donnee) => {
  const [rows] = await pool.query('SELECT * FROM donnees WHERE id_donnee = ?', [id_donnee]);
  return rows[0] || null;
}

const createDonnees = async (data) => {
  const {
    id_type, titre, description, pays, region,
    latitude, longitude, fichier_url, vignette_url, meta,
    date_collecte, acces
  } = data;

  const [result] = await pool.query(
    `INSERT INTO donnees 
    (id_type, titre, description, pays, region, latitude, longitude, fichier_url, vignette_url, meta, date_collecte, acces)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_type, titre, description, pays, region, latitude, longitude, fichier_url, vignette_url, meta, date_collecte, acces]
  );

  return { id_donnee: result.insertId, ...data };
}

module.exports = { getDonnees, getDonneesOne, createDonnees };
