const subscriptionsModel = require('./../models/subscriptionsModel');

const listSubscriptions = async(req, res, next) => {
    try {
        const subscription = await subscriptionsModel.getSubscription();
        res.json(subscription)
    } catch (error) {
        next(error)
    }
}

const listSubscriptionsOne = async(req, res, next) => {
    const { id_subscription } = req.query;
    try {
        const subscriptions = await subscriptionsModel.getSubscriptionOne(id_subscription);
        res.json(subscriptions)
    } catch (error) {
        next(error)
    }
}

const addSubscription = async (req, res, next) => {
    try {
        const newSubscription = await subscriptionsModel.createSubscription(req.body);
        res.status(201).json(newSubscription);
    } catch (error) {
        next(error);
    }
}

module.exports = { listSubscriptions, listSubscriptionsOne, addSubscription }