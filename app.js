const express = require("express");
const authRoutes = require('./routes/auth.routes')
const typesRoutes = require("./routes/types.routes");
const donneesRoutes = require('./routes/donnees.routes');
const paymentRoutes = require('./routes/payments.routes');
const subscriptionRoutes = require('./routes/subscriptions.routes')
const userRoutes = require('./routes/user.routes')
const cors = require("cors");
const path = require('path');



const errorHandler = require("./middlewares/errorHandler");

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
};

app.use(cors(corsOptions));

// middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));


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
