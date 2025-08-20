const pool = require('../config/db');

const getPayment = async() => {
    const [rows] = await pool.query('SELECT * FROM payments');
    return rows
}

const getPaymentOne = async(id) => {
    const [rows] = await pool.query('SELECT * FROM payments WHERE id_payments = ?');
    [id]
    return rows
}

const createPayments = async(data) => {
    const { id_utilisateur, subscription_id, amount, payment_method, transaction_id, payment_date, status} = data;
    const [result] = await pool.query(
        "INSERT INTO payments (id_utilisateur, subscription_id, amount, payment_method, transaction_id, payment_date, status)",
        [id_utilisateur, subscription_id, amount, payment_method, transaction_id, payment_date, status]
    );
    return { id: result.insertId}
}

module.exports = { getPayment, getPaymentOne, createPayments }