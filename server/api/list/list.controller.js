const Q = require("q");
const _ = require("lodash");
const listModel = require("./list.model");
const cardModel = require("../card/card.model");
let ObjectId = require("mongoose").Types.ObjectId;

exports.getLists = function(req, res, next) {
  listModel
    .find()
    .populate("cards")
    .then(list => res.json(list))
    .catch();
  //   listModel.find({}, function(err, lists) {
  //     if (err) {
  //       return res.json(err);
  //     }

  //     return new Promise((resolve, reject) => {

  //       listModel
  //         .populate('cards')
  //         .then(_lists => {

  //           _.forEach(lists, list => {
  //             list.cards = _.orderBy(list.cards, ["position", "title", "_id"]);
  //           });
  //           return res.json(lists);
  //         })
  //         .catch(error =>
  //           res.status(400).json({ message: "impossible to retrieve cards" })
  //         );
  //     });
  //   });
};

exports.createList = function(req, res, next) {
  var item = new listModel({
    title: req.body.title,
    position: req.body.position
  });

  Q.nfcall(item.save.bind(item)).then(function() {
    res.json({
      _id: item._id,
      title: item.title,
      position: item.position,
      cards: []
    });
  });
};

exports.editList = function(req, res, next) {
  listModel.findById(req.params.id, function(err, list) {
    if (err) {
      res
        .status(400)
        .json({ message: "impossible to update the list", error: err });
    }

    if (list) {
      _.merge(list, req.body);
      list.save(function(err) {
        if (err) {
          res.json({ message: "impossible to update the list", error: err });
        }
        res.json({ message: "list successfully updated", list });
      });
    } else {
      res.status(404).json({ message: "list not found" });
    }
  });
};

exports.removeList = function(req, res) {
  let id = req.params.id.toString();
  console.log(id);
  let query = { list: new ObjectId(id) };

  //let query = {title: "Card 3"}

  cardModel
    .remove(query)
    .then(() => {
      listModel.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          res.json({ message: "impossible to remove the List", error: err });
        }
    
        res.json({ message: "List removed successfully" });
      });
    })
    .catch(err => console.log(err));
};