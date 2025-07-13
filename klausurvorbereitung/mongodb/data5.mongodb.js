db.versicherung.drop();
db.kunde.drop();
db.abschluss.drop();

db.versicherung.insertOne({ vname: "Haftpflicht", preis: 50 });
db.kunde.insertOne({ kundennr: 3662, name: "Maier" });
db.abschluss.insertOne({
  abschlussjahr: 2017,
  versicherung: new DBRef(
    "versicherung",
    db.versicherung.findOne({ vname: "Haftpflicht" })._id
  ),
  kunde: new DBRef("kunde", db.kunde.findOne({ kundennr: 3662 })._id),
});

// Exercises ---------------------------------------------------------

// Alle Versicherungen die weniger als 100 Euro kosten

db.versicherung.find(
  {
    preis: { $lt: 100 },
  },
  {
    _id: 0,
    name: "$vname",
  }
);

// ------------------------------------------------------------------

db.abschluss.find();
db.abschluss
  .find({
    "kunde.$ref": "kunde",
    "kunde.$id": db.kunde.findOne({ name: "Maier" })._id,
  })
  .count();

// ------------------------------------------------------------------

db.abschluss.find();
db.abschluss.aggregate([
  {
    $match: {
      $expr: { $gt: ["$abschlussjahr", 2010] },
    },
  },
  {
    $group: {
      _id: "$abschlussjahr",
      sum: { $sum: 1 },
    },
  },
]);
