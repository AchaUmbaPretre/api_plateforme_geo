const typeModel = require("./../models/typesModel");

async function listTypes(req, res, next) {
  try {
    const types = await typeModel.getTypes();
    res.json(types);
  } catch (error) {
    next(error); // 👉 passe au middleware errorHandler
  }
}

async function listPays(req, res, next) {
  try {
    const types = await typeModel.getPays();
    res.json(types);
  } catch (error) {
    next(error);
  }
}

async function listProvince(req, res, next) {
  try {
    const types = await typeModel.getProvince();
    res.json(types);
  } catch (error) {
    next(error);
  }
}

async function addTypes(req, res, next) {
  try {
    const newType = await typeModel.createTypes(req.body);
    res.status(201).json(newType);
  } catch (error) {
    next(error);
  }
}

module.exports = { listTypes, listPays, listProvince, addTypes };
