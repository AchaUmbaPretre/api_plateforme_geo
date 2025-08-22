const pool = require("../config/db");

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

module.exports = { createPayment, updatePayment, getPaymentById, extendUserSubscription };
