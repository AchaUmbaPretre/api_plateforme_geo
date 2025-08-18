const express = require("express");
const typesRoutes = require("./routes/types.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// middlewares globaux
app.use(express.json());

// routes
app.use("/api/types", typesRoutes);

// gestion globale des erreurs
app.use(errorHandler);

module.exports = app;
