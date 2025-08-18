const express = require("express");
const { listTypes, addTypes } = require("../controllers/types.controller");
const validateType = require("../middlewares/validateTypes");

const router = express.Router();

router.get("/", listTypes);
router.post("/", validateType, addTypes);

module.exports = router;
