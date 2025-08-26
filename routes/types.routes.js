const express = require("express");
const { listTypes, addTypes, listPays, listProvince } = require("../controllers/types.controller");
const validateType = require("../middlewares/validateTypes");

const router = express.Router();

router.get("/", listTypes);
router.get("/pays", listPays);
router.get("/province", listProvince);
router.post("/", validateType, addTypes);

module.exports = router;
