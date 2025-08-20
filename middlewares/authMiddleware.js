const jwt = require("jsonwebtoken");
const { getUserById } = require("../models/authModel");

// Middleware d’authentification : vérifier si le token est valide
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // récupérer l'utilisateur en DB pour vérifier statut et rôle
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "Utilisateur inexistant" });
    }

    // attacher l’utilisateur à la requête pour les routes
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}

// Middleware pour vérifier les rôles (admin, abonné, etc.)
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
