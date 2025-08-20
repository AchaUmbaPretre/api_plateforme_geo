const pool = require('../config/db');

const getUser = async() => {
    const [rows] = await pool.query('SELECT * FROM utilisateurs');
    return rows
}

const getUserOne = async(id) => {
    const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE id_utilisateur = ?');
    [id]
    return rows
}


module.exports = { getUser, getUserOne }