db.kunde.deleteMany({});
db.auftrag.deleteMany({});

db.auftrag.insertOne({
  auftragsnummer: 1234,
  kosten: 5600,
  beschreibung: "Neubau Gaupe",
  jahr: 2018,
  arbeitsstunden: 14,
});

db.auftrag.insertOne({
  auftragsnummer: 1277,
  kosten: 3100,
  beschreibung: "Einbau Dachfenster",
  jahr: 2017,
  arbeitsstunden: 8,
});

db.auftrag.insertOne({
  auftragsnummer: 1287,
  kosten: 3400,
  beschreibung: "Ueberdachung",
  jahr: 2017,
  arbeitsstunden: 8,
});

db.auftrag.insertOne({
  auftragsnummer: 1235,
  kosten: 7500,
  beschreibung: "Neubau Gaupe",
  jahr: 2016,
  arbeitsstunden: 16,
});

db.kunde.insertOne({
  name: "Maier",
  wohnort: "Konstanz",
  auftraege: [
    {
      kosten: 5500,
      details: new DBRef(
        "auftrag",
        db.auftrag.findOne({ auftragsnummer: 1234 })._id
      ),
    },
    {
      kosten: 3100,
      details: new DBRef(
        "auftrag",
        db.auftrag.findOne({ auftragsnummer: 1277 })._id
      ),
    },
    {
      kosten: 3400,
      details: new DBRef(
        "auftrag",
        db.auftrag.findOne({ auftragsnummer: 1287 })._id
      ),
    },
  ],
});

db.kunde.insertOne({
  name: "Mangold",
  wohnort: "Konstanz",
  auftraege: {
    kosten: 7500,
    details: new DBRef(
      "auftrag",
      db.auftrag.findOne({ auftragsnummer: 1235 })._id
    ),
  },
});

// Exercises -----------------------------------------------------------------

// Aufgabe a)
// Wie viel Einnahmen haben die Kunden aus Konstanz jeweils beauftragt?

db.kunde.aggregate([
  {
    $match: { wohnort: "Konstanz" },
  },
  {
    $project: {
      _id: 0,
      Name: "$name",
      Summierte_Kosten: { $sum: "$auftraege.kosten" },
    },
  },
]);

// Aufgabe b)
// In welchem Jahr hat die Zimmerei am Neubau von Gaupen am meisten Geld eingenommen?

db.auftrag.aggregate([
  {
    $match: { beschreibung: "Neubau Gaupe" },
  },
  {
    $group: {
      _id: "$jahr",
      sum_cost: { $sum: "$kosten" },
    },
  },
  {
    $sort: { sum_cost: -1 },
  },
  {
    $limit: 1,
  },
]);

// Aufgabe c)
// Bei welchem Auftrag war das Verhaeltnis Kosten pro Arbeitsstunden am guenstigsten fuer die Zimmerei?

db.auftrag.aggregate([
  {
    $project: {
      _id: 0,
      Name: "$name",
      cost_p_work: { $divide: ["$kosten", "$arbeitsstunden"] },
    },
  },
  {
    $sort: { cost_p_work: -1 },
  },
  {
    $limit: 1,
  },
]);

// Aufgabe d)
// Die Kosten sind redundant bei den Auftraegen und beim Kunde gespeichert.
// Ãœberpruefen Sie, ob diese beiden Kosten irgendwo nicht identisch sind.
// Geben Sie alle Kundennamen zusammen mit der Auftragsnummer aus, bei denen diese
// Kosten nicht gleich sind.

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
    $match: {
      $expr: {
        $ne: ["$details.kosten", "$auftraege.kosten"],
      },
    },
  },
  {
    $project: {
      _id: 0,
      kundenname: "$name",
      auftragsnr: "$details.auftragsnummer",
    },
  },
]);
