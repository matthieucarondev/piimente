const express = require(`express`);

// Importation de mongoose
const mongoose = require("./mongoose_env");
// mongoose debug
mongoose.set('debug',true);

// Import des routes
const userRoute = require(`./route/user`);
const sauceRoutes = require('./route/sauce');


const path = require('path');



// Création de l'app Express
const app = express();


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
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/api/sauces', sauceRoutes);
app.use("/api/auth", userRoute);


module.exports = app;
