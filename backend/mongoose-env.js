const mongoose = require("mongoose");

// Utilisation de dotenv
const dotenv =require('dotenv');
dotenv.config();
const userMongo = process.env.USERMONGO;
const passwordMongo = process.env.PASSWORDMONGO;
const clusterMongo = process.env.CLUSTERMONGO;

// Connection à la base de données MongoDB
mongoose
  .connect(`mongodb+srv://${userMongo}:${passwordMongo}@${clusterMongo}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  module.exports = mongoose;