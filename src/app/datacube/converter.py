from rdflib import Graph, Namespace, Literal, URIRef, BNode, RDF, RDFS, OWL
import urllib

QBRV = Namespace('http://qber.data2semantics.org/vocab/')
QBR = Namespace('http://qber.data2semantics.org/resource/')

QB = Namespace('http://purl.org/linked-data/cube#')
SKOS = Namespace('http://www.w3.org/2004/02/skos/core#')
PROV = Namespace('http://www.w3.org/ns/prov#')

def safe_url(NS, local):
    safe_local = local.replace(' ','_')
    return NS[safe_local]


def data_structure_definition(dataset, variables):
    
    BASE = Namespace('http://qber.data2semantics.org/resource/{}/'.format(dataset))



    g = Graph()
    
    g.bind('qbrv',QBRV)
    g.bind('qbr',QBR)
    g.bind('qb',QB)
    g.bind('skos',SKOS)
    g.bind('prov',PROV)
    
    dataset_uri = QBR[dataset]
    structure_uri = BASE['structure']
    
    g.add((dataset_uri, RDF.type, QB['DataSet']))
    g.add((structure_uri, RDF.type, QB['DataStructureDefinition']))
    
    g.add((dataset_uri, QB['structure'], structure_uri))
    
    for variable_id, metadata in variables.items():
        variable_uri = BASE[variable_id]
        component_uri = safe_url(BASE,'component/'+variable_id)
        
        g.add((structure_uri, QB['component'], component_uri))
        
        ### DIMENSION PROPERTIES
        g.add((variable_uri, RDFS.label, Literal(variable_id)))
        
        if 'description' in metadata and metadata['description'] != "":
            g.add((variable_uri, RDFS.comment, Literal(metadata['description'])))

        if 'dimension_type' in metadata and metadata['dimension_type'] != "" :
            dimension_type_uri = URIRef(metadata['dimension_type'])
            
            if dimension_type_uri == QB['DimensionProperty']:
                g.add((variable_uri, RDF.type, dimension_type_uri))
                g.add((component_uri, QB['dimension'], variable_uri))
            elif dimension_type_uri == QB['MeasureProperty']:
                g.add((variable_uri, RDF.type, dimension_type_uri))
                g.add((component_uri, QB['measure'], variable_uri))
            elif dimension_type_uri == QB['AttributeProperty']:
                g.add((variable_uri, RDF.type, dimension_type_uri))
                g.add((component_uri, QB['attribute'], variable_uri))
        elif ('lod_variable_field' in metadata and metadata['lod_variable_field'] != "") or ('codelist_checkbox' in metadata and metadata['codelist_checkbox'] == True) or ('learn_codelist_checkbox' in metadata and metadata['learn_codelist_checkbox'] == True):
            # It must be a dimension....
            g.add((variable_uri, RDF.type, QB['DimensionProperty']))
            g.add((component_uri, QB['dimension'], variable_uri))
        else :
            # Otherwise we assume it is just an attribute
            g.add((variable_uri, RDF.type, QB['AttributeProperty']))
            g.add((component_uri, QB['attribute'], variable_uri))
                


        # If we have a variable from the LOD cloud
        if 'lod_variable_field' in metadata and metadata['lod_variable_field'] != "":
            g.add((variable_uri, RDFS.subPropertyOf, URIRef(metadata['lod_variable_field'])))
        
        
        # If we have a codelist for this variable
        if ('codelist_checkbox' in metadata and metadata['codelist_checkbox'] == True) or ('learn_codelist_checkbox' in metadata and metadata['learn_codelist_checkbox'] == True):
            # The variable should have its own codelist (a collection, since we don't know the hierarchy)
            codelist_uri = safe_url(BASE,'codelist/'+variable_id)
            g.add((codelist_uri, RDF.type, SKOS['Collection']))
            g.add((codelist_uri, RDFS.label, Literal('Code list for "{}" in dataset {}'.format(variable_id, dataset))))
            
            # The variable should be typed as a 'coded property'
            g.add((variable_uri, RDF.type, QB['CodedProperty']))
            
            # And it should point to the codelist
            g.add((variable_uri, QB['codeList'], codelist_uri))

            # Generate a SKOS concept for each of the values
            for value in metadata['values']:
                # Skip if the value is not long enough
                if value['id'].strip() == '':
                    continue
                    
                value_id = value['id']
                value_uri = safe_url(BASE,'code/'+variable_id+'/'+value_id)
                
                g.add((value_uri,RDF.type,SKOS['Concept']))
                g.add((value_uri,SKOS['prefLabel'], Literal(value_id)))
                g.add((codelist_uri,SKOS['member'], value_uri))

            # If we have a mapping specified, map to the codelist we selected
            if 'codelist_field' in metadata and metadata['codelist_field'] != "":
                g.add((codelist_uri, PROV['wasDerivedFrom'], URIRef(metadata['codelist_field'])))
            
                for mapping in metadata['mappings']:
                    source = mapping['id']
                    target = mapping['value']                

                    g.add((safe_url(BASE,'code/'+variable_id+'/'+source),SKOS['exactMatch'], URIRef(target)))
                
    return g
        
        
# def concept_transformer(label, uri='http://example.com/data/dimension', base_ns=Namespace('http://example.com/data/')):
#     g = Graph()
#
#     g.bind('qbrv',QBRV)
#     g.bind('qbr',QBR)
#     g.bind('qb',QB)
#     g.bind('data',base_ns)
    
    
    
    return 