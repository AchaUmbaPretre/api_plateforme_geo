const pool = require("../config/db");

const getPayment = async() => {

  const [rows] = await pool.query(`SELECT p.id_payments, u.nom, s.name, P.amount, p.payment_method, p.transaction_id, p.payment_date, p.status  FROM payments p
LEFT JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
INNER JOIN subscriptions s ON s.id_subscription = p.subscription_id`);
  return rows;
}

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

module.exports = { getPayment, createPayment, updatePayment, getPaymentById, extendUserSubscription };
