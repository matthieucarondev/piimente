const mongoose = require("mongoose");

// Utilisation de dotenv
const dotenv =require('dotenv');
const result = dotenv.config();

const userMongo = process.env.USERMONGO;
const passewordMongo = process.env.PASSEWORDMONGO;
const clusterMongo = process.env.CLUSTERMONGO;

// Connection à la base de données MongoDB
mongoose
  .connect(
   `mongodb+srv://${userMongo}:${passewordMongo}@${clusterMongo}.hkv4gpe.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  module.exports = mongoose;