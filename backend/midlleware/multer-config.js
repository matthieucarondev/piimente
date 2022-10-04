// importation du package multer
const multer = require('multer');
// dictionnaire de mime_types
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
// création d'un objet de configuration pour multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "image");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    if (extension == undefined) {
      callback(new Error("format invalide"));
    }
    callback(null, name + Date.now() + "." + extension);
  },
});
// exportation du middleware multer configuré
module.exports = multer({storage: storage}).single('image');