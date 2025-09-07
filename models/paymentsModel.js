const pool = require("../config/db");

const getPayment = async() => {

  const [rows] = await pool.query(`SELECT p.id_payments, u.nom, s.name, P.amount, p.payment_method, p.transaction_id, p.payment_date, p.status  FROM payments p
LEFT JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
INNER JOIN subscriptions s ON s.id_subscription = p.subscription_id`);
  return rows;
}

const getPaymentCount = async() => {

  const [rows] = await pool.query(`SELECT COUNT(p.id_payments) AS count FROM payments p`);
  return rows[0];
}

const getPaymentStat = async () => {
  const [rows] = await pool.query(`
   SELECT 
    CASE MONTH(p.payment_date)
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
    SUM(p.amount) AS amount
FROM payments p
GROUP BY MONTH(p.payment_date)
ORDER BY MONTH(p.payment_date);

  `);
  return rows;
};

const createPayment = async ({ userId, subscriptionId, amount, method }) => {
  const [result] = await pool.query(
    "INSERT INTO payments (id_utilisateur, subscription_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)",
    [userId, subscriptionId, amount, method, "pending"]
  );
  return result.insertId;
};

const updatePayment = async (paymentId, { transactionId, status, metadata }) => {
  await pool.query(
    "UPDATE payments SET transaction_id = ?, status = ?, metadata = ? WHERE id_payments = ?",
    [transactionId, status, JSON.stringify(metadata || {}), paymentId]
  );
};

const getPaymentById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM payments WHERE id_payments = ?", [id]);
  return rows[0];
};

const extendUserSubscription = async (userId, subscriptionId) => {
  // Récupérer la durée du plan
  const [[subscription]] = await pool.query(
    "SELECT duration_days FROM subscriptions WHERE id_subscription = ?",
    [subscriptionId]
  );

  if (!subscription) throw new Error("Abonnement introuvable");

  // Étendre la date d’expiration de l’utilisateur
  await pool.query(
    `UPDATE utilisateurs 
     SET abonnement_expires_le = 
        CASE 
          WHEN abonnement_expires_le IS NULL OR abonnement_expires_le < NOW()
          THEN DATE_ADD(NOW(), INTERVAL ? DAY)
          ELSE DATE_ADD(abonnement_expires_le, INTERVAL ? DAY)
        END
     WHERE id_utilisateur = ?`,
    [subscription.duration_days, subscription.duration_days, userId]
  );
};

module.exports = { getPayment, getPaymentCount, getPaymentStat, createPayment, updatePayment, getPaymentById, extendUserSubscription };
