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
            
    SELECT ?dataset ?structure ?component ?dimension ?codelist ?code ?dimension2 ?codelist2 ?code2 WHERE {
        ?dataset qb:structure ?structure .
        ?structure qb:component ?component .
        ?component qb:dimension ?dimension .
        ?dimension qb:codeList ?codelist .
        {?codelist skos:member ?code . } UNION {?code skos:inScheme ?codelist .}
        { ?dimension rdfs:subPropertyOf ?dimension2 . } UNION { ?dimension2 rdfs:subPropertyOf ?dimension .}
        { ?codelist prov:wasDerivedFrom ?codelist2 .} UNION { ?codelist2 prov:wasDerivedFrom ?codelist .}
        { ?code skos:exactMatch ?code2 . } UNION { ?code2 skos:exactMatch ?code . } 
    }

"""

def query():
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



    ### This is old style, but leaving for backwards compatibility with earlier versions of Stardog
    QUERY_HEADERS = {
                        'Accept': 'application/sparql-results+json'
                    }

    result = requests.get(ENDPOINT_URL,params={'query':edges_query}, headers=QUERY_HEADERS)

    results = json.loads(result.content)['results']['bindings']


    return results
    
    
def build_graph(results):
    g = nx.DiGraph()

    for r in results:
        for k,v in r.items():
            if v == 'tag:stardog:api:':
                # Skip the stardog specific stuff that we don't need 
                continue
            elif k in ['dataset','structure','component','dimension','codelist','code']:
                g.add_node(v,{'name': v, 'type': k, 'origin': r['dataset']})
            elif not g.has_node(v) :
                k = k.rstrip('2')
                g.add_node(v,{'name': v, 'type': k, 'origin': 'external'})
        
        g.add_edge(r['dataset'],r['structure'])
        g.add_edge(r['structure'],r['component'])
        g.add_edge(r['component'],r['dimension'])
        g.add_edge(r['dimension'],r['codelist'])
        g.add_edge(r['codelist'],r['code'])
    
        if 'dimension2' in r:
            g.add_edge(r['dimension'],r['dimension2'])
        
        if 'codelist2' in r:
            g.add_edge(r['codelist'],r['codelist2'])
        
        if 'code2' in r and r['code2'] != 'tag:stardog:api:':
            g.add_edge(r['code'],r['code2'])
            
    return g
            
            
def update(graph = None):
    if graph == None :
        results = query()
        results = dictize(results)
    else :
        results = graph.query(edges_query)
        results = [r.asdict() for r in results]
        
    g = build_graph(results)
    
    data = json_graph.node_link_data(g)

    with open('graph.json','w') as f:
        json.dump(data,f)
        
    return data
    

    
    