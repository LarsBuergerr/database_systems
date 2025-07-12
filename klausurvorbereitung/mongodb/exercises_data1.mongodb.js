// Alle Bachelor Studiengaenge mit Bachelor Abschluss, Ausgabe nur Kuerzel
db.studiengaenge.find({ abschluss: "Bachelor" }, { _id: 0, kuerzel: 1 });

// alle AIN Vorlesungen mit weniger als 5 Ects, Ausgabe nur VL Namen alphabetisc sortiert
db.vorlesungen.find({ sws: { $lt: 5 } });

db.vorlesungen.aggregate([
  {
    $lookup: {
      from: "studiengaenge",
      localField: "studiengang.$id",
      foreignField: "_id",
      as: "sg",
    },
  },
  {
    $unwind: "$sg",
  },
  {
    $match: {
      $expr: {
        $and: [
          {
            $lt: ["$sws", 5],
          },
          {
            $eq: ["$sg.kuerzel", "AIN"],
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
  {
    $sort: { name: 1 },
  },
]);

db.vorlesungen.find(
  {
    "studiengang.$ref": "studiengaenge",
    "studiengang.$id": db.studiengaenge.findOne({ kuerzel: "AIN" })._id,

    sws: { $lt: 5 },
  },
  {
    _id: 0,
    name: "$name",
  }
);

db.vorlesungen.find({
  $expr: {
    $gt: ["$sws", "$ects"],
  },
});

db.vorlesungen.aggregate([
  {
    $lookup: {
      from: "studiengaenge",
      localField: "studiengang.$id",
      foreignField: "_id",
      as: "sg",
    },
  },
  {
    $unwind: "$sg",
  },
  {
    $match: { "sg.kuerzel": "AIN" },
  },
  {
    $group: {
      _id: "$dozent",
      vl_sum: { $sum: 1 },
    },
  },
  // {
  //   $project: {
  //     _id: 0,
  //     dozent: "$dozent",
  //     vl_sum: "$vl_sum",
  //   },
  // },
]);

db.vorlesungen.aggregate([
  {
    $match: {
      "studiengang.$ref": "studiengaenge",
      "studiengang.$id": db.studiengaenge.findOne({ kuerzel: "AIN" })._id,
    },
  },
  {
    $group: {
      _id: "$dozent",
      vl_sum: { $sum: 1 },
    },
  },
]);

// $match: {
//   "studiengang.$ref": "studiengaenge",
//   "studiengang.$id": db.studiengaenge.findOne({ kuerzel: "AIN" })._id,
// },

db.vorlesungen.aggregate([
  {
    $match: {
      "studiengang.$ref": "studiengaenge",
      "studiengang.$id": db.studiengaenge.findOne({ kuerzel: "AIN" })._id,
    },
  },
  {
    $group: {
      _id: "$dozent",
      sws_sum: { $sum: "$sws" },
    },
  },
  {
    $sort: { sws_sum: -1 },
  },
  {
    $limit: 1,
  },
]);
