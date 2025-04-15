// a)
db.studiengaenge.find(
  {
    abschluss: "Bachelor",
  },
  {
    _id: 0,
    kuerzel: 1,
  }
);

// b)
db.vorlesungen
  .find(
    {
      "studiengang.$ref": "studiengaenge",
      "studiengang.$id": db.studiengaenge.findOne({ kuerzel: "AIN" })._id,
      sws: { $lt: 5 },
    },
    {
      _id: 0,
      name: 1,
    }
  )
  .sort({ name: 1 });

// c)
db.vorlesungen.find({
  $expr: {
    $gt: ["$sws", "$ects"],
  },
});

// d)
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
      count: { $sum: "$sws" },
    },
  },
  {
    $project: {
      _id: 0,
      dozent: "$_id",
      sws_sum: "$count",
    },
  },
]);

// e)
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
      count: { $sum: "$sws" },
    },
  },
  {
    $project: {
      _id: 0,
      dozent: "$_id",
      sws_sum: "$count",
    },
  },
  {
    $sort: {
      sws_sum: -1,
    },
  },
  {
    $limit: 1,
  },
]);

db.vorlesungen.aggregate([
  {
    $match: {
      "studiengang.$id": db.studiengaenge.findOne({
        kuerzel: "AIN",
      })._id,
    },
  },
  {
    $group: {
      _id: "$dozent",
      swsSumme: { $sum: "$sws" },
    },
  },
  {
    $group: {
      _id: null,
      maxSws: { $max: "$swsSumme" },
      all: { $push: { dozent: "$_id", sws: "$swsSumme" } },
    },
  },
  {
    $project: {
      _id: 0,
      dozentenMitMaxSws: {
        $filter: {
          input: "$all",
          as: "entry",
          cond: { $eq: ["$$entry.sws", "$maxSws"] },
        },
      },
    },
  },
  { $unwind: "$dozentenMitMaxSws" },
  {
    $replaceRoot: { newRoot: "$dozentenMitMaxSws" },
  },
]);
