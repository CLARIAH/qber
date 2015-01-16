from rdflib import Graph, Namespace, Literal, URIRef, BNode, RDF, RDFS, OWL


QBRV = Namespace('http://qbr.data2semantics.org/vocab/')
QBR = Namespace('http://qbr.data2semantics.org/resource/')

QB = Namespace('http://purl.org/linked-data/cube#')

def data_structure_definition(dataset, variables):
    BASE = Namespace('http://qbr.data2semantics.org/resource/{}/'.format(dataset))


    g = Graph()
    
    g.bind('qbrv',QBRV)
    g.bind('qbr',QBR)
    g.bind('qb',QB)
    
    dataset_uri = QBR[dataset]
    structure_uri = BASE['structure']
    
    g.add((dataset_uri, RDF.type, QB['DataSet']))
    g.add((structure_uri, RDF.type, QB['DataStructureDefinition']))
    
    g.add((dataset_uri, QB['structure'], structure_uri))
    
    for variable_id, metadata in variables.items():
        variable_uri = BASE[variable_id]
        
        ### DIMENSION PROPERTIES
        if 'description' in metadata:
            g.add((variable_uri, RDFS.comment, Literal(metadata['description'])))
        
        if 'dimension_map' in metadata and metadata['dimension_map'] == 'on' and 'uri_field' in metadata:
            for parent_dimension in metadata['uri_field']:
                g.add((variable_uri, RDFS.subPropertyOf, URIRef(parent_dimension)))
                
        if 'dimension_type' in metadata :
            dimension_type_uri = URIRef(metadata['dimension_type'])
            
            g.add((variable_uri, RDF.type, dimension_type_uri))
            bnode = BNode()
            
            if dimension_type_uri == QB['DimensionProperty']:
                g.add((structure_uri, QB['component'], bnode))
                g.add((bnode, QB['dimension'], variable_uri))
            elif dimension_type_uri == QB['MeasureProperty']:
                g.add((structure_uri, QB['component'], bnode))
                g.add((bnode, QB['measure'], variable_uri))
            elif dimension_type_uri == QB['AttributeProperty']:
                g.add((structure_uri, QB['component'], bnode))
                g.add((bnode, QB['attribute'], variable_uri))
                
        ### DATA CONVERSION INSTRUCTIONS
        
        data_adapters = {}
        
        if 'restrict_to_skos' in metadata and metadata['restrict_to_skos'] == 'on' and 'skos_field' in metadata:
            g.add((variable_uri, RDF.type, QB['CodedProperty']))
            
            for skos_scheme in metadata['skos_field']:
                g.add((variable_uri, QB['codeList'], URIRef(skos_scheme)))
                
            adapter = {'transformer': concept_transformer, 'uri': variable_uri, 'base_ns': BASE}
                
        if 'skos_learn' in metadata and 'use_regex' in metadata and 'regex' in metadata:
            regex = metadata['regex']
            print regex
            
            
                
    return g
        
        
def concept_transformer(label, uri='http://example.com/data/dimension', base_ns=Namespace('http://example.com/data/')):
    g = Graph()
    
    g.bind('qbrv',QBRV)
    g.bind('qbr',QBR)
    g.bind('qb',QB)
    g.bind('data',base_ns)
    
    
    
    return 