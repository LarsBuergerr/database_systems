MATCH (k1:Kunde)-[:kauf]-(a1:Artikel)
RETURN k1, a1;

// Welche artikel wurden noch nie mit 5 sternen bewertet?
MATCH (a:Artikel)
WHERE
  NOT EXISTS {
    MATCH (:Kunde)-[k:kauf]-(a)
    WHERE k.sterne = 5
  }
RETURN a;

MATCH (a:Artikel)
WHERE NOT (a)-[:kauf {sterne: 5}]-(:Kunde)
RETURN a;

MATCH (:Kunde)-[k:kauf]-(a:Artikel)
WHERE k.sterne <> 5
RETURN a;

// Welche Personen haben gleichen ARtikel gekauft und jeweils mit 5 sternen bewertet?
MATCH
  (k1:Kunde)-[:kauf {sterne: 5}]-(a:Artikel), (a)-[:kauf {sterne: 5}]-(k2:Kunde)
WHERE k1 <> k2
RETURN k1, k2, a;

// Welche Artikel werden sane vorgeschlagen?
MATCH
  (sane:Kunde {name: "Sané"})-[:kauf {sterne: 5}]-(a:Artikel),
  (a)-[:kauf {sterne: 5}]-(k2:Kunde),
  (k2)-[:kauf {sterne: 5}]-(a2:Artikel)
WHERE NOT (sane)-[:kauf]-(a2) AND sane <> k2 AND a <> a2
RETURN a2;