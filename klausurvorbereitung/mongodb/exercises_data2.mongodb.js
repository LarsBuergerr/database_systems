db.abt.find();

// Welche Abteilungen haben keine Mitarbeiter?

db.abt.aggregate([
  {
    $lookup: {
      from: "pers",
      localField: "_id",
      foreignField: "abteilung.$id",
      as: "a",
    },
  },
  {
    $match: { a: [] },
  },
  {
    $project: {
      _id: 0,
      "abteilungs-nr": "$anr",
    },
  },
]);

// Wer hat einen Chef der jünger ist als er selbst? Vergleichen Sie die Anfrage mit
// einem äquivalenten SQL-Befehl

db.pers.aggregate([
  {
    $lookup: {
      from: "pers",
      localField: "vorgesetzter.$id",
      foreignField: "_id",
      as: "v",
    },
  },
  {
    $unwind: "$v",
  },
  {
    $match: {
      $expr: {
        $and: [
          {
            $ne: ["$v", []],
          },
          { $eq: [{ $type: "$jahrg" }, "int"] },
          { $eq: [{ $type: "$v.jahrg" }, "int"] },
          {
            $lt: ["$jahrg", "$v.jahrg"],
          },
        ],
      },
    },
  },
  {
    $project: {
      _id: 0,
      name: "$name",
    },
  },
]);

// Wer hat einen Chef der jünger ist als er selbst? Vergleichen Sie die Anfrage mit
// einem äquivalenten SQL-Befehl

db.pers.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      jahrg: 1,
      vorgesetzter_id: "$vorgesetzter.$id",
    },
  },
  {
    $lookup: {
      from: "pers",
      localField: "vorgesetzter_id",
      foreignField: "_id",
      as: "vorgesetzter_doc",
    },
  },
  {
    $match: {
      $and: [
        { jahrg: { $ne: null } },
        { vorgesetzter_doc: { $ne: [] } },
        {
          $expr: {
            $gt: ["$jahrg", { $arrayElemAt: ["$vorgesetzter_doc.jahrg", 0] }],
          },
        },
      ],
    },
  },
]);

// Welche Abteilung hat durchschnittlich die jüngsten Mitarbeiter? Es sollen nur die
// Abteilungsnummer und der Abteilungsname ausgegeben werden

db.abt.aggregate([
  {
    $lookup: {
      from: "pers",
      localField: "_id",
      foreignField: "abteilung.$id",
      as: "mitarbeiter",
    },
  },
  {
    $project: {
      _id: 0,
      "abteilungs-nr": "$anr",
      abteilungsname: "$name",
      altersdurchschnitt: { $avg: "$mitarbeiter.jahrg" },
    },
  },
  {
    $match: { altersdurchschnitt: { $ne: null } },
  },
  {
    $sort: { altersdurchschnitt: 1 },
  },
  {
    $limit: 1,
  },
]);
