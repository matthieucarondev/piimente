const sauce=require(`../models/Sauce`);
const fs = require('fs');

exports.createSauce = (req, res, next) => {
     const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
   delete sauceObject._userId;
  const Sauce = new sauce({
       ...sauceObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
   });
  Sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce créée !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;
    sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            if (Sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then((modifySauce) => res.status(200).json({ modifySauce, message: "Sauce modifiée !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
   sauce.findOne({ _id: req.params.id})
       .then(Sauce=> {
           if (Sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = Sauce.imageUrl.split('/image/')[1];
               fs.unlink(`image/${filename}`, () => {
                   sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getAllSauce = (req, res, next) => {
  sauce
    .find()
    .then((Sauces) => {
      res.status(200).json(Sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
exports.evaluateSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        // Si la sauce n'est pas aimée
        case -1:
          sauce
            .updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id,
              }
            )
            .then(() =>
              res.status(201).json({
                message: "Votre avis est bien pris en compte (dislike) !",
              })
            )
            .catch((error) => res.status(400).json({ error }));
          break;

        case 0:
          // Si la sauce est déjà aimée et que l'utilisateur veut retirer son like
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            sauce
              .updateOne(
                { _id: req.params.id },
                {
                  $inc: { likes: -1 },
                  $pull: { usersLiked: req.body.userId },
                  _id: req.params.id,
                }
              )
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Votre avis a bien été modifié !" })
              )
              .catch((error) => res.status(400).json({ error }));
          }

          // Si la sauce n'est déjà pas aimée et que l'utilisateur veut retirer son dislike
          else if (
            sauce.usersDisliked.find((user) => user === req.body.userId)
          ) {
            sauce
              .updateOne(
                { _id: req.params.id },
                {
                  $inc: { dislikes: -1 },
                  $pull: { usersDisliked: req.body.userId },
                  _id: req.params.id,
                }
              )
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Votre avis a bien été modifié !" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        // Si la sauce est aimée
        case 1:
          sauce
            .updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
                _id: req.params.id,
              }
            )
            .then(() =>
              res.status(201).json({
                message: "Votre avis est bien pris en compte (like) !",
              })
            )
            .catch((error) => res.status(400).json({ error }));
          break;
        default:
          return res.status(500).json({ error });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
