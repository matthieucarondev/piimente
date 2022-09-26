// importation mongoose
const mongoose = require (`mongoose`);
// importation mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');


// modele de base de donnée pour signup 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
// sécurite pour ne pas enrgistrer deux fois le même email
userSchema.plugin(uniqueValidator);
// exportation du module
module.exports = mongoose.model('User', userSchema);