from rdflib import Dataset, Graph, Namespace, Literal, URIRef, BNode, RDF, RDFS, OWL, XSD
import urllib
import datetime
import iribaker

QBRV = Namespace('http://data.socialhistory.org/vocab/')
QBR = Namespace('http://data.socialhistory.org/resource/')

QB = Namespace('http://purl.org/linked-data/cube#')
SKOS = Namespace('http://www.w3.org/2004/02/skos/core#')
PROV = Namespace('http://www.w3.org/ns/prov#')
NP = Namespace('http://www.nanopub.org/nschema#')
FOAF = Namespace('http://xmlns.com/foaf/0.1/')


def safe_url(NS, local):
    """Generates a URIRef from the namespace + local part that is relatively safe for
    use in RDF graphs

    Arguments:
    NS      -- a @Namespace object
    local   -- the local name of the resource
    """
    safe_local = local.replace(' ', '_')
    return NS[safe_local]


def get_base_uri(dataset):
    return Namespace('http://data.socialhistory.org/resource/{}/'.format(dataset))


def get_value_uri(dataset, variable, value):
    """Generates a variable value IRI for a given combination of dataset, variable and value"""
    BASE = get_base_uri(dataset)

    return iribaker.to_iri(BASE['code/' + variable + '/' + value])


def get_variable_uri(dataset, variable):
    """Generates a variable IRI for a given combination of dataset and variable"""
    BASE = get_base_uri(dataset)

    return iribaker.to_iri(BASE[variable])


def data_structure_definition(dataset, variables, profile, source_path, source_hash):
    """Converts the dataset + variables to a set of rdflib Graphs (a nanopublication with provenance annotations)
    that contains the data structure definition (from the DataCube vocabulary) and
    the mappings to external datasets.

    Arguments:
    dataset     -- the name of the dataset
    variables   -- the list of dictionaries with the variables and their mappings to URIs
    profile     -- the Google signin profile
    source_path -- the path to the dataset file that was annotated
    source_hash -- the Git hash of the dataset file version of the dataset

    :returns: an RDF graph store containing a nanopublication
    """
    BASE = Namespace('http://data.socialhistory.org/resource/{}/'.format(dataset))

    # Initialize a conjunctive graph for the whole lot
    rdf_dataset = Dataset()
    rdf_dataset.bind('qbrv', QBRV)
    rdf_dataset.bind('qbr', QBR)
    rdf_dataset.bind('qb', QB)
    rdf_dataset.bind('skos', SKOS)
    rdf_dataset.bind('prov', PROV)
    rdf_dataset.bind('np', NP)
    rdf_dataset.bind('foaf', FOAF)

    # Initialize the graphs needed for the nanopublication
    timestamp = datetime.datetime.now().isoformat()

    hash_part = source_hash + '/' + timestamp


    # The Nanopublication consists of three graphs
    assertion_graph_uri = BASE['assertion/' + hash_part]
    assertion_graph = rdf_dataset.graph(assertion_graph_uri)

    provenance_graph_uri = BASE['provenance/' + hash_part]
    provenance_graph = rdf_dataset.graph(provenance_graph_uri)

    pubinfo_graph_uri = BASE['pubinfo/' + hash_part]
    pubinfo_graph = rdf_dataset.graph(pubinfo_graph_uri)



    # A URI that represents the author
    author_uri = QBR['person/' + profile['email']]

    rdf_dataset.add((author_uri, RDF.type, FOAF['Person']))
    rdf_dataset.add((author_uri, FOAF['name'], Literal(profile['name'])))
    rdf_dataset.add((author_uri, FOAF['email'], Literal(profile['email'])))
    rdf_dataset.add((author_uri, QBRV['googleId'], Literal(profile['id'])))
    rdf_dataset.add((author_uri, FOAF['depiction'], URIRef(profile['image'])))




    # A URI that represents the version of the dataset source file
    dataset_version_uri = BASE[source_hash]

    # Some information about the source file used
    rdf_dataset.add((dataset_version_uri, QBRV['path'], Literal(source_path, datatype=XSD.string)))
    rdf_dataset.add((dataset_version_uri, QBRV['sha1_hash'], Literal(source_hash, datatype=XSD.string)))

    # ----
    # The nanopublication itself
    # ----
    nanopublication_uri = BASE['nanopublication/' + hash_part]

    rdf_dataset.add((nanopublication_uri, RDF.type, NP['Nanopublication']))
    rdf_dataset.add((nanopublication_uri, NP['hasAssertion'], assertion_graph_uri))
    rdf_dataset.add((assertion_graph_uri, RDF.type, NP['Assertion']))
    rdf_dataset.add((nanopublication_uri, NP['hasProvenance'], provenance_graph_uri))
    rdf_dataset.add((provenance_graph_uri, RDF.type, NP['Provenance']))
    rdf_dataset.add((nanopublication_uri, NP['hasPublicationInfo'], pubinfo_graph_uri))
    rdf_dataset.add((pubinfo_graph_uri, RDF.type, NP['PublicationInfo']))

    # ----
    # The provenance graph
    # ----

    # Provenance information for the assertion graph (the data structure definition itself)
    provenance_graph.add((assertion_graph_uri, PROV['wasDerivedFrom'], dataset_version_uri))
    provenance_graph.add((assertion_graph_uri, PROV['generatedAtTime'], Literal(timestamp, datatype=XSD.datetime)))
    provenance_graph.add((assertion_graph_uri, PROV['wasAttributedTo'], author_uri))

    # ----
    # The publication info graph
    # ----

    # The URI of the latest version of QBer
    # TODO: should point to the actual latest commit of this QBer source file.
    # TODO: consider linking to this as the plan of some activity, rather than an activity itself.
    qber_uri = URIRef('https://github.com/CLARIAH-SDH/qber.git')

    pubinfo_graph.add((nanopublication_uri, PROV['wasGeneratedBy'], qber_uri))
    pubinfo_graph.add((nanopublication_uri, PROV['generatedAtTime'], Literal(timestamp, datatype=XSD.datetime)))
    pubinfo_graph.add((nanopublication_uri, PROV['wasAttributedTo'], author_uri))

    # ----
    # The assertion graph
    # ----
    dataset_uri = QBR[dataset]
    structure_uri = BASE['structure']

    assertion_graph.add((dataset_uri, RDF.type, QB['DataSet']))
    assertion_graph.add((structure_uri, RDF.type, QB['DataStructureDefinition']))

    assertion_graph.add((dataset_uri, QB['structure'], structure_uri))


    for variable_id, metadata in variables.items():
        variable_uri = BASE[variable_id]
        component_uri = safe_url(BASE, 'component/' + variable_id)

        assertion_graph.add((structure_uri, QB['component'], component_uri))

        # DIMENSION PROPERTIES
        assertion_graph.add((variable_uri, RDFS.label, Literal(variable_id)))

        if 'description' in metadata and metadata['description'] != "":
            assertion_graph.add((variable_uri, RDFS.comment, Literal(metadata['description'])))

        if 'dimension_type' in metadata and metadata['dimension_type'] != "":
            dimension_type_uri = URIRef(metadata['dimension_type'])

            if dimension_type_uri == QB['DimensionProperty']:
                assertion_graph.add((variable_uri, RDF.type, dimension_type_uri))
                assertion_graph.add((component_uri, QB['dimension'], variable_uri))
            elif dimension_type_uri == QB['MeasureProperty']:
                assertion_graph.add((variable_uri, RDF.type, dimension_type_uri))
                assertion_graph.add((component_uri, QB['measure'], variable_uri))
            elif dimension_type_uri == QB['AttributeProperty']:
                assertion_graph.add((variable_uri, RDF.type, dimension_type_uri))
                assertion_graph.add((component_uri, QB['attribute'], variable_uri))
        elif ('lod_variable_field' in metadata and metadata['lod_variable_field'] != "") or ('codelist_checkbox' in metadata and metadata['codelist_checkbox'] == True) or ('learn_codelist_checkbox' in metadata and metadata['learn_codelist_checkbox'] == True):
            # It must be a dimension....
            assertion_graph.add((variable_uri, RDF.type, QB['DimensionProperty']))
            assertion_graph.add((component_uri, QB['dimension'], variable_uri))
        else :
            # Otherwise we assume it is just an attribute
            assertion_graph.add((variable_uri, RDF.type, QB['AttributeProperty']))
            assertion_graph.add((component_uri, QB['attribute'], variable_uri))

        # If we have a variable from the LOD cloud
        if 'lod_variable_field' in metadata and metadata['lod_variable_field'] != "":
            assertion_graph.add((variable_uri, RDFS.subPropertyOf, URIRef(metadata['lod_variable_field'])))

        # If we have a codelist for this variable
        if ('codelist_checkbox' in metadata and metadata['codelist_checkbox'] is True) or ('learn_codelist_checkbox' in metadata and metadata['learn_codelist_checkbox'] is True):
            # The variable should have its own codelist (a collection, since we don't know the hierarchy)
            codelist_uri = safe_url(BASE, 'codelist/' + variable_id)
            assertion_graph.add((codelist_uri, RDF.type, SKOS['Collection']))
            assertion_graph.add((codelist_uri, RDFS.label, Literal('Code list for "{}" in dataset {}'.format(variable_id, dataset))))

            # The variable should be typed as a 'coded property'
            assertion_graph.add((variable_uri, RDF.type, QB['CodedProperty']))

            # And it should point to the codelist
            assertion_graph.add((variable_uri, QB['codeList'], codelist_uri))

            # Generate a SKOS concept for each of the values
            for value in metadata['values']:
                # Skip if the value is not long enough
                if value['id'].strip() == '':
                    continue

                value_id = value['id']
                value_uri = safe_url(BASE,'code/' + variable_id + '/' + value_id)

                assertion_graph.add((value_uri, RDF.type, SKOS['Concept']))
                assertion_graph.add((value_uri, SKOS['prefLabel'], Literal(value_id)))
                assertion_graph.add((codelist_uri, SKOS['member'], value_uri))

            # If we have a mapping specified, map to the codelist we selected
            if 'codelist_field' in metadata and metadata['codelist_field'] != "":
                assertion_graph.add((codelist_uri, PROV['wasDerivedFrom'], URIRef(metadata['codelist_field'])))
                print metadata['mappings']
                for mapping in metadata['mappings'].values():
                    source = mapping['id']
                    target = mapping['value']

                    assertion_graph.add((safe_url(BASE, 'code/' + variable_id + '/' + source), SKOS['exactMatch'], URIRef(target)))

    for c in rdf_dataset.contexts():
        print c

    return rdf_dataset


# Because Trig serialization in RDFLib is extremely crappy
import string


def reindent(s, numSpaces):
    s = s.split('\n')
    s = [(numSpaces * ' ') + string.lstrip(line) for line in s]
    s = "\n".join(s)
    return s


def serializeTrig(rdf_dataset):
    turtles = []
    for c in rdf_dataset.contexts():
        if c.identifier != URIRef('urn:x-rdflib:default'):
            turtle = "<{id}> {{\n".format(id=c.identifier)
            turtle += reindent(c.serialize(format='turtle'), 4)
            turtle += "}\n\n"
        else :
            turtle = c.serialize(format='turtle')
            turtle += "\n\n"

        turtles.append(turtle)

    return "\n".join(turtles)
