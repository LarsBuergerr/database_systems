db.studiengaenge.drop();
db.vorlesungen.drop();

db.createCollection("studiengaenge", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Studiengaenge der HTWG Konstanz",
      required: ["kuerzel", "name", "abschluss"],
      properties: {
        kuerzel: {
          enum: ["AIN", "WIN", "GIB", "MSI"],
          description: "Kuerzel des Studiengangs",
        },
        name: {
          bsonType: "string",
          description: "Name des Moduls",
        },
        abschluss: {
          enum: ["Bachelor", "Master"],
          description: "Abschluss des Studiengangs",
        },
      },
    },
  },
});

db.createCollection("vorlesungen", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Vorlesungen der HTWG Konstanz",
      required: ["name", "dozent", "semester", "studiengang", "sws", "ects"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name der Vorlesung",
        },
        dozent: {
          bsonType: "string",
          description: "Dozent der Vorlesung",
        },
        semester: {
          bsonType: "int",
          description: "Semester der Vorlesung",
        },
        studiengang: {
          bsonType: "object",
          description: "Studiengang der Vorlesung",
        },
        sws: {
          bsonType: "int",
          description: "SWS der Vorlesung",
        },
        ects: {
          bsonType: "int",
          description: "ECTS der Vorlesung",
        },
      },
    },
  },
});

db.studiengaenge.insertMany([
  { kuerzel: "AIN", name: "Angewandte Informatik", abschluss: "Bachelor" },
  { kuerzel: "WIN", name: "Wirtschaftsinformatik", abschluss: "Bachelor" },
  { kuerzel: "GIB", name: "Gesundheitsinformati", abschluss: "Bachelor" },
  { kuerzel: "MSI", name: "Master Informatik", abschluss: "Master" },
]);

const ain = db.studiengaenge.findOne({ kuerzel: "AIN" });
const win = db.studiengaenge.findOne({ kuerzel: "WIN" });
const gib = db.studiengaenge.findOne({ kuerzel: "GIB" });
const msi = db.studiengaenge.findOne({ kuerzel: "MSI" });

const studiengaenge = [ain, win, gib, msi];

studiengaenge.forEach((studiengang) => {
  db.vorlesungen.insertMany([
    {
      name: "Datenbanken",
      dozent: "Prof. Dr. Eck",
      semester: 1,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 5,
      ects: 4,
    },
    {
      name: "Datenbanken",
      dozent: "Prof. Dr. Eck",
      semester: 1,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 10,
      ects: 4,
    },
    {
      name: "Programmierung",
      dozent: "Prof. Dr. Schmidt",
      semester: 1,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 4,
      ects: 10,
    },
    {
      name: "Algorithmen und Datenstrukturen",
      dozent: "Prof. Dr. Weber",
      semester: 2,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 3,
      ects: 6,
    },
    {
      name: "Software Engineering",
      dozent: "Prof. Dr. Fischer",
      semester: 3,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 4,
      ects: 8,
    },
    {
      name: "IT-Sicherheit",
      dozent: "Prof. Dr. Wagner",
      semester: 4,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 2,
      ects: 5,
    },
    {
      name: "Künstliche Intelligenz",
      dozent: "Prof. Dr. Becker",
      semester: 5,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 3,
      ects: 6,
    },
    {
      name: "Webentwicklung",
      dozent: "Prof. Dr. Braun",
      semester: 3,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 4,
      ects: 8,
    },
    {
      name: "Big Data",
      dozent: "Prof. Dr. Keller",
      semester: 6,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 3,
      ects: 6,
    },
    {
      name: "Projektmanagement",
      dozent: "Prof. Dr. Eck",
      semester: 4,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 2,
      ects: 5,
    },
    {
      name: "Cloud Computing",
      dozent: "Prof. Dr. Lehmann",
      semester: 5,
      studiengang: DBRef("studiengaenge", studiengang._id),
      sws: 3,
      ects: 6,
    },
  ]);
});
