const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;

    if (!authHeader) {
      return res.status(400).send({ message: "Não foi fornecido um token" });
    }

    jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ error: "Token inválido" });
      }
      //id do usuário dono do Token
      req.body.idUser = decoded.idUser;
      return next();
    });
  } catch (error) {
    return res.status(403).json({ error: "Authentication failed" });
  }
};
