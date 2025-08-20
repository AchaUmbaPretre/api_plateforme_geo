const paymentModel = require('./../models/paymentsModel');

const listPayment = async(req, res, next) => {
    try {
        const payment = await paymentModel.getPayment();
        res.json(payment)
    } catch (error) {
        next(error)
    }
}

const listPaymentOne = async(req, res, next) => {
    const { id_payments } = req.query;
    try {
        const payment = await paymentModel.getPaymentOne(id_payments);
        res.json(payment)
    } catch (error) {
        next(error)
    }
}

const addPayments = async (req, res, next) => {
    try {
        const newPayment = await paymentModel.addPayments(req.body);
        res.status(201).json(newPayment);
    } catch (error) {
        next(error);
    }
}

module.exports = { listPayment, listPaymentOne, addPayments }