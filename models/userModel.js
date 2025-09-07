const pool = require('../config/db');

const getUser = async() => {
    const [rows] = await pool.query('SELECT * FROM utilisateurs');
    return rows
}

const getUserCount = async() => {
    const [rows] = await pool.query('SELECT COUNT( DISTINCT u.id_utilisateur) AS count FROM utilisateurs u');
    return rows[0]
}

const getUserOne = async(id) => {
    const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE id_utilisateur = ?');
    [id]
    return rows
}

const getUserStat = async () => {
  const [rows] = await pool.query(`
    SELECT 
    CASE MONTH(u.created_at)
        WHEN 1 THEN 'Janv'
        WHEN 2 THEN 'Févr'
        WHEN 3 THEN 'Mars'
        WHEN 4 THEN 'Avr'
        WHEN 5 THEN 'Mai'
        WHEN 6 THEN 'Juin'
        WHEN 7 THEN 'Juil'
        WHEN 8 THEN 'Août'
        WHEN 9 THEN 'Sept'
        WHEN 10 THEN 'Oct'
        WHEN 11 THEN 'Nov'
        WHEN 12 THEN 'Déc'
    END AS month,
    COUNT(u.id_utilisateur) AS users
FROM utilisateurs u
GROUP BY MONTH(u.created_at)
ORDER BY MONTH(u.created_at);

  `);
  return rows;
};


module.exports = { getUser, getUserCount, getUserOne, getUserStat }