MATCH (n)
DETACH DELETE n

// EG

CREATE (O089:Raum:Eingang {id: 'O-089', etage: 0})
CREATE
  (O001:Raum:Poolraum {id: 'O-001', etage: 0, anzSitze: 20, ausstattung: []})
CREATE (O085:Raum:Zwischenraum {id: 'O-085', etage: 0})
CREATE
  (O086:Raum:Poolraum {id: 'O-086', etage: 0, anzSitze: 10, ausstattung: []})
CREATE (O083:Raum:Zwischenraum {id: 'O-083', etage: 0})
CREATE (O009:Raum:Druckerraum {id: 'O-009', etage: 0})
CREATE (O010:Raum:Teekueche {id: 'O-010', etage: 0})
CREATE (O091:Raum:Toilette {id: 'O-091', etage: 0, geschlecht: 'herren'})
CREATE (O092:Raum:Teekueche {id: 'O-092', etage: 0})
CREATE
  (O002:Raum:Hoersaal
    {id: 'O-002', etage: 0, anzSitze: 100, ausstattung: ['Beamer', 'Tafel']})
CREATE (O003:Raum:Buero {id: 'O-003', etage: 0, personal: ['Eiermann']})
CREATE (O004:Raum:Buero {id: 'O-004', etage: 0, personal: ['Eigelsperger']})
CREATE (O005:Raum:Buero {id: 'O-005', etage: 0, personal: []})
CREATE (O006:Raum:Buero {id: 'O-006', etage: 0, personal: []})
CREATE (O088:Raum:Zwischenraum {id: 'O-088', etage: 0})
CREATE
  (O007:Raum:Hoersaal
    {id: 'O-007', etage: 0, anzSitze: 17, ausstattung: ['Beamer', 'Tafel']})
CREATE
  (O008:Raum:Hoersaal
    {id: 'O-008', etage: 0, anzSitze: 33, ausstattung: ['Beamer', 'Tafel']})

// Wege

CREATE (O089)-[:WEG {dauer: 1, barrierefrei: 1}]->(O001)
CREATE (O089)-[:WEG {dauer: 1, barrierefrei: 1}]->(O085)