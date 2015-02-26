import app.config as config
from rdflib import Graph, URIRef
import requests


### This is old style, but leaving for backwards compatibility with earlier versions of Stardog
QUERY_HEADERS = {
                    'Accept': 'application/sparql-results+json',
                    'SD-Connection-String': 'reasoning={}'.format(config.REASONING_TYPE)
                }
                
UPDATE_HEADERS = {
    'Content-Type': 'application/sparql-update',
    'SD-Connection-String': 'reasoning={}'.format(config.REASONING_TYPE)
}

def resolve(uri, depth=2, current_depth=0, visited = set()):
    print current_depth, uri
    if current_depth == depth:
        print "reached max depth"
        return True, visited
    
    # If the URI is already present in our triple store, we won't follow...
    if uri in visited:
        print uri, "already visited"
        return True, visited
    if ask_graph(URIRef(uri).defrag()) :
        print uri, "already known"
        visited.add(uri)
        return True, visited
    else :
        g = Graph()
        try :
            g.parse(uri)
        except :
            try :
                g.parse(uri, format='turtle')
            except Exception as e:
                print "Oops", e
                visited.add(uri)
                return False, visited
    
        # Add the gleaned triples to the store
        update_query = make_update(g,graph_uri=URIRef(uri).defrag())
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
    if graph_uri == None :
        template = "INSERT DATA {{ {} }}"
        query = template.format(graph.serialize(format='nt'))
    else :
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

def sparql(query, strip=False, endpoint_url = config.ENDPOINT_URL):
    """This method replaces the SPARQLWrapper SPARQL interface, since SPARQLWrapper cannot handle the Stardog-style query headers needed for inferencing"""
    
    result = requests.get(endpoint_url,params={'query': query, 'reasoning': config.REASONING_TYPE}, headers=QUERY_HEADERS)
    try :
        result_dict = json.loads(result.content)
    except Exception as e:
        return result.content
    
    if strip:
        new_results = []
        for r in result_dict['results']['bindings']:
            new_result = {}
            for k, v in r.items():
                print k, v
                if v['type'] == 'uri' and not k+'_label' in r.keys():
                    new_result[k+'_label'] = {}
                    new_result[k+'_label']['type'] = 'literal'
                    new_result[k+'_label']['value'] = v['value'][v['value'].rfind('/')+1:]
                    
                elif not k+'_label' in r.keys():
                    new_result[k+'_label'] = {}
                    new_result[k+'_label']['type'] = 'literal'
                    new_result[k+'_label']['value'] = v['value']
                    
                new_result[k+'_stripped'] = {}
                new_result[k+'_stripped']['type'] = 'literal'
                new_result[k+'_stripped']['value'] = v['value'][v['value'].rfind('/')+1:]
                
                
                new_result[k] = v
                    
            new_results.append(new_result)
                   
        log.debug(new_results)
        return new_results
    else :
        return result_dict['results']['bindings']