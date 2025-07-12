CALL gds.graph.drop('graph') YIELD graphName;

CALL
  gds.graph.project(
    'graph',
    'Raum',
    'WEG',
    {relationshipProperties: ['dauer', 'barrierefrei']}
  )

// 1

MATCH (b1:Buero)
WHERE "Eck" IN b1.personal
MATCH (b2:Buero)
WHERE "Eiermann" IN b2.personal
CALL
  gds.shortestPath.dijkstra.stream(
    'graph',
    {
      sourceNode: id(b1),
      targetNode: id(b2),
      relationshipWeightProperty: 'dauer'
    }
  )
  YIELD path, totalCost
RETURN path, totalCost


// 2

MATCH (eingang:Eingang {id: 'O-089'})
MATCH (pr:Hoersaal {etage: 1}) WHERE pr.anzSitze >= 30
CALL gds.shortestPath.dijkstra.stream("graph", {sourceNode: eingang, targetNode: pr, relationshipWeightProperty: 'dauer'})
YIELD path, totalCost
RETURN path, totalCost
ORDER BY totalCost ASC
LIMIT 1


// 3

MATCH (raum:Raum {id: 'O-107'})
MATCH (toilette:Toilette {geschlecht: 'herren'})
CALL gds.shortestPath.dijkstra.stream("graph", {sourceNode: raum, targetNode: toilette, relationshipWeightProperty: 'dauer'})
YIELD path, totalCost
RETURN path, totalCost


// 4

CALL gds.graph.drop('graph_barrierefrei') YIELD graphName;

CALL
gds.graph.filter(
  'graph_barrierefrei',
  'graph',
  '*',
  'r.barrierefrei >= 1.0'
)

MATCH (eingang:Eingang {id: 'O-088'})
MATCH (raum:Raum {id: 'O-102'})
CALL gds.shortestPath.dijkstra.stream("graph_barrierefrei", {sourceNode: eingang, targetNode: raum, relationshipWeightProperty: 'dauer'})
YIELD path, totalCost
RETURN path, totalCost