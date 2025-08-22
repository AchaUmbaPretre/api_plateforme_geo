import db from "../config/db";

export const createPayment = async ({ userId, subscriptionId, amount, method }) => {
  const [result] = await db.query(
    "INSERT INTO payments (id_utilisateur, subscription_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)",
    [userId, subscriptionId, amount, method, "pending"]
  );
  return result.insertId;
};

export const updatePayment = async (paymentId, { transactionId, status, metadata }) => {
  await db.query(
    "UPDATE payments SET transaction_id = ?, status = ?, metadata = ? WHERE id_payments = ?",
    [transactionId, status, JSON.stringify(metadata || {}), paymentId]
  );
};

export const getPaymentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM payments WHERE id_payments = ?", [id]);
  return rows[0];
};
