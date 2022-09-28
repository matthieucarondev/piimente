const Sauce = require(`../models/Sauce`);
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const newSauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
  });
  newSauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce créée !",
        contenu: req.body,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//Met à jour la sauce avec l'_id fourni. Si une image est téléchargée, elle est capturée et l’imageUrl de la sauce est mise à jour.
//Si aucun fichier n'est fourni,les informations sur la sauce se trouvent directement dans le corps de la requête (req.body.name,
//req.body.heat, etc.).
//Si un fichier est fourni, la sauce transformée en chaîne de caractères se trouve dans req.body.sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

      if (!sauce) {
        res.status(404).json({ error: new Error('Object inexistant !') });
        return
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ error: new Error('Requête non autorisé !') });
        return
      }
      const filename = sauce.imageUrl.split('/image')[1];
      fs.unlink(`image/${filename}`, sauce=> {
      const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then((modifySauce) => res.status(200).json({ modifySauce, message: "Sauce modifiée !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error }));
           });
    });
};
  


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/image/")[1];
        fs.unlink(`image/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
exports.evaluateSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        // Si la sauce n'est pas aimée
        case -1:
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: req.body.userId },
              _id: req.params.id,
            },
          )
            .then(() =>
              res.status(201).json({
                message: "Votre avis est bien pris en compte (dislike) !",
              }),
            )
            .catch((error) => res.status(400).json({ error }));
          break;

        case 0:
          // Si la sauce est déjà aimée et que l'utilisateur veut retirer son like
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id,
              },
            )
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Votre avis a bien été modifié !" }),
              )
              .catch((error) => res.status(400).json({ error }));
          }

          // Si la sauce n'est déjà pas aimée et que l'utilisateur veut retirer son dislike
          else if (
            sauce.usersDisliked.find((user) => user === req.body.userId)
          ) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              },
            )
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Votre avis a bien été modifié !" }),
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        // Si la sauce est aimée
        case 1:
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
              $push: { usersLiked: req.body.userId },
              _id: req.params.id,
            },
          )
            .then(() =>
              res.status(201).json({
                message: "Votre avis est bien pris en compte (like) !",
              }),
            )
            .catch((error) => res.status(400).json({ error }));
          break;
        default:
          return res.status(500).json({ error });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
