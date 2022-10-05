// importation du modèle sauce
const Sauce = require(`../models/Sauce`);
// importation des packages fs
const fs = require("fs");
/******************exportation de la fonction qui va créer une sauce (gère la route POST)***********************/
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
/************** exportation de la fonction qui va récupérer une seule sauce (gère la route GET)*************************/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
/***************** exportation de la fonction qui va modifier une sauce (gère la route PUT)************************/
exports.modifySauce = (req, res, next) => { 
    const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/image/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
       if (!sauce) {
        res.status(404).json({ error: new Error('Object inexistant !') });
        return
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ error: new Error('Requête non autorisé !') });
        return
      }
      if (req.file) {
        const filename = sauce.imageUrl.split("/image/")[1];
        fs.unlink(`image/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/******************exportation de la fonction qui va supprimer une sauce (gère la route DELETE)*************************/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Requête non autorisé !" });
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
/*****************exportation de la fonction qui va récupérer toutes les sauces (gère la route GET)******************/
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
/************************exportation de la fonction qui va gérer les likes et les dislikes******************************/
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
