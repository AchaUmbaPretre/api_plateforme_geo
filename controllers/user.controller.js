const userModel = require('./../models/userModel');

const listUser = async(req, res, next) => {
    try {
        const user = await userModel.getUser();
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

module.exports = { listUser, listUserOne }