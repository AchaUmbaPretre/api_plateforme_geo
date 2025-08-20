const express = require("express");
const authRoutes = require('./routes/auth.routes')
const typesRoutes = require("./routes/types.routes");
const donneesRoutes = require('./routes/donnees.routes');
const paymentRoutes = require('./routes/payments.routes');
const subscriptionRoutes = require('./routes/subscriptions.routes')
const userRoutes = require('./routes/user.routes')

const errorHandler = require("./middlewares/errorHandler");

const app = express();

// middlewares globaux
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/types", typesRoutes);
app.use("/api/donnees", donneesRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/user", userRoutes);




// gestion globale des erreurs
app.use(errorHandler);

module.exports = app;
