const db = require("../config/db");

const AuthModel = {
  async findUserByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM utilisateurs WHERE email = ?", [email]);
    return rows[0];
  },

  async findUserByPhone(phone) {
    const [rows] = await db.execute("SELECT * FROM utilisateurs WHERE phone = ?", [phone]);
    return rows[0];
  },

  async findUserById(id) {
    const [rows] = await db.execute("SELECT * FROM utilisateurs WHERE id_utilisateur = ?", [id]);
    return rows[0];
  },

  async createUser({ nom, email, phone, passwordHash, role }) {
    const [result] = await db.execute(
      "INSERT INTO utilisateurs (nom, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [nom, email, phone, passwordHash, role || "abonne"]
    );
    return result.insertId;
  }
};

module.exports = AuthModel;
