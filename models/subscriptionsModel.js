const pool = require('../config/db');

const getSubscription = async() => {
    const [rows] = await pool.query('SELECT * FROM subscriptions');
    return rows
}

const getSubscriptionOne = async(id) => {
    const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id_subscription = ?');
    [id]
    return rows
}

const createSubscription = async(data) => {
    const { name, price, duration_days } = data;
    const [result] = await pool.query(
        "INSERT INTO subscriptions (name, price, duration_days)",
        [name, price, duration_days]
    );
    return { id: result.insertId}
}

module.exports = { getSubscription, getSubscriptionOne, createSubscription }