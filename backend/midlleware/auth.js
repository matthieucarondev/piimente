// importation jsonwebtoken
const jwt = require("jsonwebtoken");
// importation de dotenv
const dotenv =require('dotenv');
dotenv.config();
// exportation de la fonction middleware qui va vérifier le token envoyé avant d'autoriser les requêtes
module.exports = (req, res, next) => {
  try {
    // récupération du token dans le header authorization
    const token = req.headers.authorization.split(" ")[1];
     // vérification du token
    const decodedToken = jwt.verify(token,`${process.env.RANDOM_TOKEN_SECRET}`); // "RANDOM_TOKEN_SECRET"   
     // décodage du token
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
