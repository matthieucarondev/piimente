const cryptJs = require (`crypto-js`);
const bcrypt = require(`bcrypt`);
const jwt = require('jsonwebtoken');
const User = require(`../models/user`);
const emailValidator = require('email-validator');

// Utilisation de dotenv
const dotenv = require('dotenv');
const result =dotenv.config();
const CRYPTOJS_EMAIL = process.env.CRYPTOJS_EMAIL;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

   
//crer utilisateur
exports.signup = (req, res, next) => {
   // Crypter l'email avant de l'envoyer dans la base de donnée
    const emailCryptoJs = cryptJs.HmacSHA256(req.body.email,CRYPTOJS_EMAIL).toString();
if (emailValidator.validate(req.body.email)) {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailCryptoJs,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
      } else {
            res.status(400).json({ error: `Le format de l'adresse email est invalide.` })
      }
 };

exports.login = (req, res, next) => {
      const emailCryptoJs = cryptJs.HmacSHA256(req.body.email, CRYPTOJS_EMAIL).toString();

       User.findOne({ email:emailCryptoJs})
       .then(user => {
           if (!user) {
               return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
           }
           bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                       return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                   }
                   res.status(200).json({
                       userId: user._id,
                       token: jwt.sign(
                           { userId: user._id },
                           RANDOM_TOKEN_SECRET,
                           { expiresIn: `24h` })
                   });
               })
               .catch(error => res.status(500).json({ error }));
       })
       .catch(error => res.status(500).json({ error }));
};
