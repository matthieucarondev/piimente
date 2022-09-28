const express = require(`express`);
const path = require('path');
// Importation de mongoose
const mongoose = require('./mongoose-env');
// Création de l'app Express
const app = express();
// mongoose debug
mongoose.set('debug',true);
// nportation morgan(logger http)
const morgan =require('morgan');

// logger les requet et reponse 
app.use(morgan("dev"));
// Import des routes
const userRoute = require(`./route/user`);
const sauceRoute = require('./route/sauce');

// Headers pour contourner les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
// Conversion de la requête
app.use(express.json());

// Routes de l'API
app.use(`/image`, express.static(path.join(__dirname, 'image')));
app.use(`/api/sauces`, sauceRoute);
app.use(`/api/auth`, userRoute);




module.exports = app;
