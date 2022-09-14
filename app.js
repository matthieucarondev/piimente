const express = require(`express`);
const mongoose = require("mongoose");
const bodyParser = require(`body-parser`);
const userRoute = require(`./route/user`);
const sauceRoutes = require('./route/sauce');
const path = require('path');

const app = express();

mongoose
  .connect(
    `mongodb+srv://caronmatthieu:joujou@clusterpimente.hkv4gpe.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use("/api/auth", userRoute);
module.exports = app;
