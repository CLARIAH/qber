from app.config import ENDPOINT_URL
import networkx as nx
import requests
import json
from sparql_client import dictize
from networkx.readwrite import json_graph
from rdflib import Namespace


edges_query = """
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX qb: <http://purl.org/linked-data/cube#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>


    SELECT DISTINCT ?dataset ?dimension ?name ?image ?dataset2 ?dimension2 ?name2 ?image2 WHERE {
        GRAPH ?provenance_graph {
            ?assertion_graph prov:wasAttributedTo ?person .
        }
        ?person foaf:depiction ?image .
        ?person foaf:name      ?name .
        GRAPH ?assertion_graph {
            ?dataset qb:structure/qb:component/qb:dimension ?dimension .
            { ?dimension rdfs:subPropertyOf ?dimension2 . }
            UNION
            { ?dimension2 rdfs:subPropertyOf ?dimension .}
        }
          OPTIONAL {
            GRAPH ?assertion_graph2 {
                    {
                        ?dataset2 qb:structure/qb:component/qb:dimension ?dimension2 .
                    }
                    UNION
                    {
                        ?dimension2 rdfs:label [] .
                    }
            }
            GRAPH ?provenance_graph2 {
                  ?assertion_graph2 prov:wasAttributedTo ?person2
            }
            ?person2 foaf:name ?name2 .
            ?person2 foaf:depiction ?image2 .
          }
    }
"""

# edges_query = """
#     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
#                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#                 PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
#                 PREFIX dct: <http://purl.org/dc/terms/>
#                 PREFIX prov: <http://www.w3.org/ns/prov#>
#                 PREFIX qb: <http://purl.org/linked-data/cube#>
#
#     SELECT ?dataset ?structure ?component ?dimension ?codelist ?code ?dimension2 ?codelist2 ?code2 WHERE {
#             ?dataset qb:structure ?structure .
#             ?structure qb:component ?component .
#             ?component qb:dimension ?dimension .
#             ?dimension qb:codeList ?codelist .
#             {?codelist skos:member ?code . }
#             UNION
#             {?code skos:inScheme ?codelist .}
#             { ?dimension rdfs:subPropertyOf ?dimension2 . }
#             UNION
#             { ?dimension2 rdfs:subPropertyOf ?dimension .}
#             { ?codelist prov:wasDerivedFrom ?codelist2 .}
#             UNION
#             { ?codelist2 prov:wasDerivedFrom ?codelist .}
#             { ?code skos:exactMatch ?code2 . }
#             UNION
#             { ?code2 skos:exactMatch ?code . }
#     }
#
# """

# query_all = """
#     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
#                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
#                 PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
#                 PREFIX dct: <http://purl.org/dc/terms/>
#                 PREFIX prov: <http://www.w3.org/ns/prov#>
#                 PREFIX qb: <http://purl.org/linked-data/cube#>
#
#     SELECT ?dataset ?structure ?component ?dimension ?codelist ?code ?dimension2 ?codelist2 ?code2 WHERE {
#         ?dataset qb:structure ?structure .
#         ?structure qb:component ?component .
#         ?component qb:dimension ?dimension .
#         ?dimension qb:codeList ?codelist .
#         {?codelist skos:member ?code . } UNION {?code skos:inScheme ?codelist .}
#         OPTIONAL {?dimension rdfs:subPropertyOf ?dimension2 }
#         OPTIONAL {?codelist prov:wasDerivedFrom ?codelist2 }
#         OPTIONAL {?code skos:exactMatch ?code2 }
#     }
#
# """


def query():
    # This is old style, but leaving for backwards compatibility with earlier versions of Stardog
    QUERY_HEADERS = {'Accept': 'application/sparql-results+json'}

    result = requests.get(ENDPOINT_URL,
                          params={'query': edges_query},
                          headers=QUERY_HEADERS)

    results = json.loads(result.content)['results']['bindings']

    return results


def build_graph(results):
    g = nx.DiGraph()

    for r in results:
        for k, v in r.items():
            if v == 'tag:stardog:api:':
                # Skip the stardog specific stuff that we don't need
                continue
            elif k in ['dataset', 'dimension']:
                g.add_node(v, {'name': v, 'type': k, 'origin': r['dataset']})
            elif k in ['name']:
                g.add_node(v, {'name': v, 'type': 'person', 'image': r['image']})
            elif k in ['name2'] and not g.has_node(v):
                g.add_node(v, {'name': v, 'type': 'person', 'image': r['image2']})
            elif not g.has_node(v) and k not in ['image2', 'image']:
                print "Adding external {}".format(k)
                k = k.rstrip('2')
                g.add_node(v, {'name': v, 'type': k, 'origin': 'external'})

        print "Edge between {} and {}".format(r['dataset'], r['dimension'])
        g.add_edge(r['dataset'], r['dimension'])
        print "Edge between {} and {}".format(r['dataset'], r['name'])
        g.add_edge(r['dataset'], r['name'])

        if 'dimension2' in r:
            print "dimension2 in r: {}".format(r['dimension2'])
            print "Edge between {} and {}".format(r['dimension'], r['dimension2'])
            g.add_edge(r['dimension'], r['dimension2'])
            if 'dataset2' in r:
                print "Edge between {} and {}".format(r['dataset2'], r['dimension2'])
                g.add_edge(r['dataset2'], r['dimension2'])
                print "Edge between {} and {}".format(r['dataset2'], r['name2'])
                g.add_edge(r['dataset2'], r['name2'])
            elif 'name2' in r:
                print "Edge between {} and {}".format(r['dataset2'], r['name2'])
                g.add_edge(r['dimension2'], r['name2'])

    return g


def update(graph=None):
    print "Graph is: {}".format(graph)
    if graph is None:
        results = query()
        results = dictize(results)
    else:
        results = graph.query(edges_query)
        results = [r.asdict() for r in results]

    # results = query()
    # results = dictize(results)

    g = build_graph(results)

    data = json_graph.node_link_data(g)

    print data

    with open('graph.json','w') as f:
        json.dump(data,f)

    return data
