import app.config as config
from rdflib import Graph, URIRef, Dataset
import requests
import json


# This is old style, but leaving for backwards compatibility with earlier versions of Stardog
QUERY_HEADERS = {
                 'Accept': 'application/sparql-results+json',
                 'SD-Connection-String': 'reasoning={}'.format(config.REASONING_TYPE)
                }

UPDATE_HEADERS = {
    'Content-Type': 'application/sparql-update',
    'SD-Connection-String': 'reasoning={}'.format(config.REASONING_TYPE)
}

def resolve(uri, depth=2, current_depth=0, visited = set()):
    """ Resolves the URI to the maximum depth specified by 'depth' """
    print current_depth, uri
    if current_depth == depth:
        print "reached max depth"
        return True, visited

    # If the URI is already present in our triple store, we won't follow...
    if uri in visited:
        print uri, "already visited"
        return True, visited
    print uri, "not visited yet"

    if ask_graph(URIRef(uri).defrag()):
        print uri, "already known"
        visited.add(uri)
        return True, visited
    else:
        print uri, "not yet known"
        g = Graph()
        try :
            print "Trying to parse", uri
            g.parse(uri)
        except :
            try :
                print "Trying to parse", uri, "as turtle"
                g.parse(uri, format='turtle')
            except Exception as e:
                import traceback
                traceback.print_exc()
                visited.add(uri)
                return False, visited

        # Add the gleaned triples to the store
        update_query = make_update(g, graph_uri=URIRef(uri).defrag())
        sparql_update(update_query)
        print uri, "added to triple store"
        visited.add(uri)
        # We'll visit every triple in the file we downloaded
        # Alternatively only use those where the 'uri' is a subject (but that makes caching harder)
        for s,p,o in g.triples((None, None, None)) :
            # Resolve every object 'o' (as long as it is a URI)
            if isinstance(o, URIRef) :
                success, visited = resolve(o, depth=depth, current_depth  = current_depth + 1, visited = visited)

    return True, visited


def make_update(graph, graph_uri = None):
    if isinstance(graph, Dataset):
        nts = []
        for c in graph.contexts():
            if c.identifier != URIRef('urn:x-rdflib:default'):
                nt = "GRAPH <{id}> {{\n".format(id=c.identifier)
                nt += c.serialize(format='nt')
                nt += "}\n\n"
            else:
                nt = c.serialize(format='nt')
                nt += "\n\n"

            nts.append(nt)
        query = "INSERT DATA {{ {} }}".format("\n".join(nts))
    elif isinstance(graph, Graph):
        if graph_uri == None :
            template = "INSERT DATA {{ {} }}"
            query = template.format(graph.serialize(format='nt'))
        else:
            template = "INSERT DATA {{ GRAPH <{}> {{ {} }} }}"
            query = template.format(graph_uri, graph.serialize(format='nt'))

    return query


def ask_graph(uri, endpoint_url = config.ENDPOINT_URL):
    return ask(uri, template = "ASK {{ GRAPH <{}> {{ ?s ?p ?o }} }}", endpoint_url=endpoint_url)


def ask(uri, template = "ASK {{ <{}> ?p ?o }}", endpoint_url = config.ENDPOINT_URL):
    query = template.format(uri)
    result = requests.get(endpoint_url, params={'query': query, 'reasoning': config.REASONING_TYPE}, headers={'Accept': 'text/boolean'})

    if result.content == 'false' or result.content == 'False':
        return False
    elif result.content == 'true' or result.content == 'True':
        return True
    else :
        return result.content


def sparql_update(query, endpoint_url = config.UPDATE_URL):

    result = requests.post(endpoint_url,params={'reasoning': config.REASONING_TYPE}, data=query, headers=UPDATE_HEADERS)

    print "SPARQL UPDATE response: ", result.content

    return result.content

def sparql(query, endpoint_url = config.ENDPOINT_URL):
    """This method replaces the SPARQLWrapper SPARQL interface, since SPARQLWrapper cannot handle the Stardog-style query headers needed for inferencing"""

    try :
        result = requests.get(endpoint_url, params={'query': query, 'reasoning': config.REASONING_TYPE}, headers=QUERY_HEADERS)
        result_dict = json.loads(result.content)
    except Exception as e:
        print e
        return result.content

    return result_dict['results']['bindings']


def dictize(sparql_results):
    # If the results are a dict, just return the list of bindings
    if isinstance(sparql_results, dict):
        sparql_results = sparql_results['results']['bindings']

    results = []

    for r in sparql_results :
        result = {}
        for k,v in r.items():
            try :
                result[k] = v['value']
            except :
                print k, v

        results.append(result)

    return results
