// In which movies did Tom Hanks play
MATCH (pers:Person {name: "Tom Hanks"})-[:ACTED_IN]-(movie:Movie)
RETURN pers, movie;

// Who directed Cloud Atlas?

MATCH (pers:Person)-[:DIRECTED]-(movie:Movie {title: "Cloud Atlas"})
RETURN pers.name;

// who where tom hanks co-actors?

MATCH (pers:Person {name: "Tom Hanks"})-[:ACTED_IN]-(m)-[:ACTED_IN]-(co_actor)
WHERE pers <> co_actor
RETURN DISTINCT co_actor.name;

// How people are related to "Cloud Atlas"?
MATCH (p:Person)-[rel]-(movie:Movie {title: "Cloud Atlas"})
RETURN p, Type(rel);

MATCH
  path =
    SHORTESTPATH
    (
    (p:Person {name: "Kevin Bacon"})-[*1..4]-
    (p2:Person {name: "Meg Ryan"}))
RETURN path;

//Extend Tom Hanks co-actors to find co-co-actors who have nоt worked with Tom Hanks.

MATCH
  (tom:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(co_actor),
  (co_actor)-[:ACTED_IN]-(m2)-[:ACTED_IN]-(co_co_actor)
WHERE
  NOT (tom)-[:ACTED_IN]->()<-[:ACTED_IN]-(co_co_actor) AND tom <> co_co_actor
RETURN DISTINCT co_co_actor.name;

MATCH
  (tom:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(coActors),
  (coActors)-[:ACTED_IN]->(m2)<-[:ACTED_IN]-(cocoActors)
WHERE NOT (tom)-[:ACTED_IN]->()<-[:ACTED_IN]-(cocoActors) AND tom <> cocoActors
RETURN cocoActors.name AS Recommended, count(*) AS Strength
ORDER BY Strength DESC;

// Welche sind sind drei häufigsten Directors, mit denen Tom Hanks zusammen gdreht hat?
MATCH
  (tom:Person {name: "Tom Hanks"})-[:ACTED_IN]-
  (m:Movie)-[:DIRECTED]-
  (director:Person)
RETURN director.name AS Director, count(m) AS Anzahl
ORDER BY count(m) DESCENDING
LIMIT 3;

MATCH
  (tom:Person {name: 'Tom Hanks'})-[:ACTED_IN]->
  (f:Movie)<-[r:DIRECTED]-
  (d:Person)
WITH d, count(r) AS anz
RETURN d.name AS Director, anz
ORDER BY anz
LIMIT 3;

// Welche sind sind drei häufigsten Directors, mit denen Tom Hanks zusammen gdreht hat?
MATCH
  (tom:Person {name: 'Tom Hanks'})-[:ACTED_IN]->
  (f:Movie)<-[r:DIRECTED]-
  (d:Person)
WITH d, count(r) AS anz
ORDER BY anz DESC
LIMIT 3
RETURN d.name AS Director, anz AS Anzahl;

// adding the Knows relationship
MATCH
  (a1:Person)-[r:ACTED_IN|DIRECTED|PRODUCED|WROTE]->
  (movie:Movie)<-[r2:ACTED_IN|DIRECTED|PRODUCED|WROTE]-
  (a2:Person)
WHERE a1 <> a2
WITH DISTINCT a1, a2
MERGE (a1)-[k1:KNOWS]->(a2)
RETURN count(k1);

MATCH (p:Person)-[:KNOWS]-(p2:Person)
RETURN p, p2;

// potenzielle filmpartner von keanue reeves er soll die personen nicht kennen aber eine personen die er kennt soll diese person kennen.
MATCH
  (keanu:Person {name: "Keanu Reeves"})-[:KNOWS]-(p1:Person),
  (p1)-[:KNOWS]-(p2:Person)
WHERE NOT (keanu)-[:KNOWS]-(p2) AND p2 <> keanu
WITH DISTINCT p2 // the distinct is important here
RETURN count(p2) AS Anzahl;

// potenzielle filmpartner von keanue reeves er soll die personen nicht kennen aber eine personen die er kennt soll diese person kennen.
MATCH
  (k:Person {name: 'Keanu Reeves'})<-[:KNOWS]-
  (a:Person)<-[:KNOWS]-
  (potentialPartner:Person)
WHERE NOT (potentialPartner)-[:KNOWS]->(k) AND k <> potentialPartner
WITH DISTINCT potentialPartner
RETURN count(potentialPartner) AS Anzahl;

MATCH
  p =
    SHORTESTPATH
    (
    (kevin:Person {name: "Kevin Bacon"})-[:ACTED_IN*]-
    (keanu:Person {name: "Keanu Reeves"}))
RETURN p, length(p);

// welche actors haben schon min 3 filme zusammen gespielt
MATCH (s1:Person)-[:ACTED_IN]-(m)-[:ACTED_IN]-(s2:Person)
WITH s1, s2, count(m) AS anz
WHERE anz >= 3 AND elementId(s1) > elementId(s2)
RETURN DISTINCT s1.name AS Schauspieler1, s2.name AS Schauspieler2, anz;

// welche actors haben schon min 3 filme zusammen gespielt
MATCH (a:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(b:Person)
WHERE id(a) > id(b)
WITH a, b, count(m) AS AnzahlFilme
WHERE AnzahlFilme >= 3
RETURN a.name, b.name, AnzahlFilme