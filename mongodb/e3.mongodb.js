db.abt.drop();
db.pers.drop();

db.abt.insertMany([
  { anr: "K51", name: "Entwicklung", ort: "Erlangen" },
  { anr: "K53", name: "Buchhaltung", ort: "Nürnberg" },
  { anr: "K54", name: "Hochschule", ort: "Konstanz" },
  { anr: "K55", name: "Personal", ort: "Nürnberg" },
]);
db.pers.insertOne({
  pnr: 123,
  name: "Mueller",
  jahrg: 1980,
  eindat: new Date("2000-09-01"),
  gehalt: 88000,
  beruf: "Kaufmann",
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Entwicklung" })._id),
});
db.pers.insertOne({
  pnr: 406,
  name: "Coy",
  jahrg: 1972,
  eindat: new Date("2006-09-01"),
  gehalt: 100000,
  beruf: "Programmierer",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Mueller" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Personal" })._id),
});
db.pers.insertOne({
  pnr: 829,
  name: "Schmidt",
  jahrg: 1982,
  eindat: new Date("2010-06-01"),
  gehalt: 94000,
  beruf: "Kaufmann",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Mueller" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Buchhaltung" })._id),
});
db.pers.insertOne({
  pnr: 874,
  name: "Abel",
  eindat: new Date("2014-05-01"),
  gehalt: 82000,
  beruf: "Softw.Entwickler",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Schmidt" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Personal" })._id),
});
db.pers.insertOne({
  pnr: 503,
  name: "Junghans",
  jahrg: 1997,
  gehalt: 80000,
  beruf: "Programmierer",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Mueller" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Entwicklung" })._id),
});

// a)
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
    $match: {
      mitarbeiter: { $eq: [] },
    },
  },
]);

// b)
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

// c)
db.pers.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      jahrg: 1,
      abteilung: 1,
    },
  },
  {
    $lookup: {
      from: "abt",
      localField: "abteilung.$id",
      foreignField: "_id",
      as: "abteilung_doc",
    },
  },
  {
    $unwind: "$abteilung_doc",
  },
  {
    $group: {
      _id: "$abteilung_doc.name",
      abteilungs_nr: { $first: "$abteilung_doc.anr" },
      durchschnitt: { $avg: "$jahrg" },
    },
  },
  {
    $project: {
      _id: 0,
      abteilungs_nr: 1,
      durchschnitt: 1,
    },
  },
  {
    $sort: { durchschnitt: -1 },
  },
  {
    $limit: 1,
  },
]);
