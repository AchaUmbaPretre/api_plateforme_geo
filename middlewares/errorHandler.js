function errorHandler(err, req, res, next) {
  console.error("❌ Erreur attrapée :", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur"
  });
}

module.exports = errorHandler;
