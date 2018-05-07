const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL);

const Card = require("../api/card/card.model");

// const cards = [
//   {
//     title: "Card 1",
//     description: "description card 1",
//     dueDate: new Date()
//   },
//   {
//     title: "Card 2",
//     description: "description card 2",
//     dueDate: new Date()
//   },
//   {
//     title: "Card 3",
//     description: "description card 3",
//     dueDate: new Date()
//   }
// ];

// Card.create(cards, (err, cardsDocs) => {

//   if (err) {
//     throw err;
//   }
//   console.log(`Created ${cardsDocs.length} cards`);
//   mongoose.connect.close();
// });

const List = require("../api/list/list.model");

const list = [
  {
    title: "TO-DO",
    position: 1,
    cards: []
  }
];

List.create(list, (err, listsDocs) => {
  if (err) {
    throw err;
  }
  console.log(`Created ${listsDocs.length} lists`);
  //mongoose.connect.close();

  let list = listsDocs[0]._id;

  const cards = [
    {
      title: "Card 1",
      description: "description card 1",
      dueDate: new Date(),
      list
    },
    {
      title: "Card 2",
      description: "description card 2",
      dueDate: new Date(),
      list
    },
    {
      title: "Card 3",
      description: "description card 3",
      dueDate: new Date(),
      list
    }
  ];

  Card.create(cards, (err, cardsDocs) => {
    let arrayCards = [];
    cardsDocs.forEach(e => {
      arrayCards.push(e._id);
    });

    List.findByIdAndUpdate(list, { cards: arrayCards }).then(() => {
      mongoose.connection.close();
    });
  });
});
