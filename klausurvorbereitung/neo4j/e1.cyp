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
RETURN director, count(m)
ORDER BY count(m) DESCENDING
LIMIT 3