const userModel = require('./../models/userModel');

const listUser = async(req, res, next) => {
    try {
        const user = await userModel.getUser();
        res.json(user)
    } catch (error) {
        next(error)
    }
}

const countUser = async(req, res, next) => {
    try {
        const user = await userModel.getUserCount();
        res.json(user)
    } catch (error) {
        next(error)
    }
}

const listUserOne = async(req, res, next) => {
    const { id_utilisateur  } = req.query;
    try {
        const user = await userModel.getUserOne(id_utilisateur );
        res.json(user)
    } catch (error) {
        next(error)
    }
}

const listUserStat = async(req, res, next) => {
    try {
        const stat = await userModel.getUserStat();
        res.json(stat)
    } catch (error) {
        next(error)
    }
}

module.exports = { listUser, countUser, listUserOne, listUserStat }