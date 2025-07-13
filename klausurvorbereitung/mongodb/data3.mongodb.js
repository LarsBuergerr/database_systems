db.auftrag.drop();
db.kunde.drop();

const m1Result = db.auftrag.insertOne({
  auftragsnummer: 1234,
  kosten: 5000,
  beschreibung: "Entwicklung Onlineshop",
  jahr: 2019,
});

const m2Result = db.auftrag.insertOne({
  auftragsnummer: 1217,
  kosten: 300,
  beschreibung: "Installation Server",
  jahr: 2020,
});

const m3Result = db.auftrag.insertOne({
  auftragsnummer: 1235,
  kosten: 5000,
  beschreibung: "Server Setup",
  jahr: 2019,
});

db.kunde.insertOne({
  name: "Schmidt",
  adresse: "Bodanstrasse 10 78462 Konstanz",
  auftraege: [
    { kosten: 5000, details: DBRef("auftrag", m1Result.insertedId) },
    { kosten: 300, details: DBRef("auftrag", m2Result.insertedId) },
  ],
});

db.kunde.insertOne({
  name: "Mueller",
  adresse: "Schaenzlebruecke",
  auftraege: [{ kosten: 5000, details: DBRef("auftrag", m3Result.insertedId) }],
});

// Exercises ------------------------------------------------------------------------

// -----------------------------------------------------------------------
// wie viele kosten haben die einzelnen Kunden
db.kunde.aggregate([
  {
    $project: {
      _id: 0,
      sum: { $sum: "$auftraege.kosten" },
    },
  },
]);

db.kunde.find(
  {},
  {
    _id: 0,
    name: "$name",
    sum: { $sum: "$auftraege.kosten" },
  }
);

// -----------------------------------------------------------------------
//2
db.kunde.find();
db.kunde.aggregate([
  {
    $unwind: "$auftraege",
  },
  {
    $match: {
      "auftraege.details.$ref": "auftrag",
      "auftraege.details.$id": db.auftrag.findOne({
        auftragsnummer: 1217,
      })._id,
    },
  },
]);

db.kunde.aggregate([
  {
    $unwind: "$auftraege",
  },
  {
    $lookup: {
      from: "auftrag",
      localField: "auftraege.details.$id",
      foreignField: "_id",
      as: "details",
    },
  },
  {
    $unwind: "$details",
  },
  {
    $group: {
      _id: "$details.jahr",
      summe: { $sum: "$details.kosten" },
    },
  },
  {
    $sort: { summe: -1 },
  },
  {
    $limit: 1,
  },
  {
    $project: {
      _id: 0,
      Jahrgang: "$_id",
      Summe: "$summe",
    },
  },
]);

// -----------------------------------------------------------------------
// 3
db.auftrag
  .aggregate([
    {
      $match: { jahr: 2019 },
    },
    {
      $group: {
        _id: "$beschreibung",
        summe: { $sum: "$kosten" },
      },
    },
  ])
  .forEach(function (u) {
    print(u._id + " " + u.summe);
  });
