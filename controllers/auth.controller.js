const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../models/authModel");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const JWT_EXPIRES_IN = "1h";

const AuthController = {
  
  async register(req, res) {
    try {
      const { nom, email, phone, password } = req.body;

      if (!nom || !phone || !password) {
        return res.status(400).json({ message: "Nom, téléphone et mot de passe sont obligatoires" });
      }

      const existingUser = email 
        ? await AuthModel.findUserByEmail(email) 
        : await AuthModel.findUserByPhone(phone);

      if (existingUser) {
        return res.status(400).json({ message: "Cet utilisateur existe déjà" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = await AuthModel.createUser({ nom, email, phone, passwordHash });

      res.status(201).json({ message: "Utilisateur créé avec succès", userId });
    } catch (error) {
      console.error("Erreur inscription:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async login(req, res) {
    try {
      const { email, phone, password } = req.body;

      if ((!email && !phone) || !password) {
        return res.status(400).json({ message: "Email ou téléphone + mot de passe requis" });
      }

      const user = email 
        ? await AuthModel.findUserByEmail(email) 
        : await AuthModel.findUserByPhone(phone);

      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Vérification d'abonnement
      const now = new Date();
      if (user.abonnement_expires_le && new Date(user.abonnement_expires_le) < now) {
        return res.status(403).json({ message: "Votre abonnement a expiré" });
      }

      const token = jwt.sign(
        { id: user.id_utilisateur, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id_utilisateur,
          nom: user.nom,
          email: user.email,
          phone: user.phone,
          role: user.role,
          abonnement_expires_le: user.abonnement_expires_le
        }
      });
    } catch (error) {
      console.error("Erreur login:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

module.exports = AuthController;
