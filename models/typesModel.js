const pool = require("../config/db");

async function getTypes() {
  const [rows] = await pool.query("SELECT * FROM types_donnees");
  return rows;
}

async function createTypes(types) {
  const { nom_type, slug, description } = types;
  const [result] = await pool.query(
    "INSERT INTO types_donnees (nom_type, slug, description) VALUES (?, ?, ?)",
    [nom_type, slug, description]
  );
  return { id: result.insertId, ...types };
}

module.exports = { getTypes, createTypes };
