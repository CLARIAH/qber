# -*- coding: utf-8 -*-
from flask import render_template, request, jsonify
from flask.ext.socketio import emit
import logging
import requests
import json
import os
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph
from collections import OrderedDict

import config
import util.sparql_client as sc
import util.file_client as fc
import util.inspector
import util.git_client as git_client

from app import app, socketio

import loader.reader
import datacube.converter

log = app.logger
log.setLevel(logging.DEBUG)


@app.route('/')
def index():
    return render_template('base.html')


@app.route('/inspector')
def inspector():
    return render_template('inspector.html')


@app.route('/inspect')
def inspect():
    data = util.inspector.update()
    return jsonify(data)


# Socket IO handlers

@socketio.on('message', namespace='/inspector')
def message(json):
    log.debug('SocketIO message:\n' + str(json))
#
#
# @socketio.on('connect', namespace='/inspector')
# def connect():
#     log.debug('SocketIO connected')
#     emit('response', {'data': 'Connected'})
#
#
# @socketio.on('disconnect', namespace='/inspector')
# def disconnect():
#     log.debug('SocketIO disconnected')


@app.route('/metadata')
def metadata():
    """Loads the metadata for a dataset specified by the 'file' relative path argument"""
    dataset_file = request.args.get('file', False)

    # Check whether a file has been provided
    if not dataset_file:
        return jsonify({'result': 'Error: you should provide me with a relative path to the file you want to load'})

    # Create an absolute path
    dataset_path = os.path.join(config.base_path, dataset_file)
    log.debug('Dataset path: ' + dataset_path)

    # Specify the dataset's details
    # TODO: this is hardcoded, and needs to be gleaned from the dataset file metadata
    dataset = {
        'filename': dataset_path,
        'format': 'CSV',
        'header': True
    }

    # Intialize a file a dapter for the dataset
    adapter = loader.adapter.get_adapter(dataset)

    variables = adapter.get_header()
    metadata = adapter.get_metadata()
    examples = adapter.get_examples()

    # Not used
    # short_metadata = {metadata.keys()[0]: metadata[metadata.keys()[0]]}

    # Get the LSD dimensions from the LSD service (or a locally cached copy)
    # And concatenate it with the dimensions in the CSDH
    dimensions = get_lsd_dimensions() + get_csdh_dimensions()

    dimensions_as_dict = {dim['uri']: dim for dim in dimensions}

    dimensions_as_dict = OrderedDict(sorted(dimensions_as_dict.items(), key=lambda t: t[1]['refs']))
    # Get all known SKOS schemes and collections from the LOD cache service
    schemes = get_schemes() + get_csdh_schemes()

    cache = read_cache(dataset_path)

    (head, dataset_local_name) = os.path.split(dataset_file)
    (dataset_name, extension) = os.path.splitext(dataset_local_name)

    # Prepare the data dictionary
    data = {
        'file': dataset_name,
        'path': dataset_path,
        'variables': variables,
        'metadata': metadata,
        'examples': examples,
        'dimensions': dimensions_as_dict,
        'schemes': schemes,
        'cache': cache
    }

    return jsonify(data)


def read_cache(dataset_path):

    dataset_cache_filename = "{}.cache.json".format(dataset_path)

    if os.path.exists(dataset_cache_filename):
        with open(dataset_cache_filename, 'r') as dataset_cache_file:
            dataset_cache = json.load(dataset_cache_file)

        return dataset_cache
    else :
        return {}


def write_cache(dataset_path, data):
    dataset_cache_filename = "{}.cache.json".format(dataset_path)

    with open(dataset_cache_filename, 'w') as dataset_cache_file:
        json.dump(data, dataset_cache_file)


@app.route('/menu', methods=['POST'])
def menu():
    """Render the menu for the items specified in the POST data (i.e. the variable names)"""
    req_json = request.get_json(force=True)
    log.debug(req_json)

    items = req_json['items']
    log.debug(items)

    return render_template('menu.html', items=items)


@app.route('/variable/ui', methods=['POST'])
def variable():
    """Takes the variable details from the POST data and returns the UI for editing"""
    req_json = request.get_json(force=True)
    log.debug(req_json)

    variable_id = req_json['id']
    if 'description' in req_json:
        description = req_json['description']
    else:
        description = req_json['id']
    if 'examples' in req_json:
        examples = req_json['examples']
    else:
        examples = []

    log.debug(examples)

    return render_template('variable.html',
                           id=variable_id,
                           description=description,
                           examples=examples)


@app.route('/variable/resolve', methods=['GET'])
def dimension():
    """Resolves the URI of a variable and retrieves its definition"""
    uri = request.args.get('uri', False)

    if uri:
        exists = sc.sparql("""
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

            ASK {{<{}> rdfs:label ?l .}}""".format(uri))

        if "true" not in exists:
            success, visited = sc.resolve(uri, depth=2)
            print "Resolved ", visited
        else:
            success = True

        if success:
            query = """
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                PREFIX dct: <http://purl.org/dc/terms/>
                PREFIX qb: <http://purl.org/linked-data/cube#>

                SELECT (<{URI}> as ?uri) ?type ?description ?measured_concept WHERE {{
                    OPTIONAL
                    {{
                        <{URI}>   rdfs:comment ?description .
                    }}
                    OPTIONAL
                    {{
                        <{URI}>   a  qb:DimensionProperty .
                        BIND(qb:DimensionProperty AS ?type )
                    }}
                    OPTIONAL
                    {{
                        <{URI}>   qb:concept  ?measured_concept .
                    }}
                    OPTIONAL
                    {{
                        <{URI}>   a  qb:MeasureProperty .
                        BIND(qb:MeasureProperty AS ?type )
                    }}
                    OPTIONAL
                    {{
                        <{URI}>   a  qb:AttributeProperty .
                        BIND(qb:AttributeProperty AS ?type )
                    }}
                }}

            """.format(URI=uri)

            results = sc.sparql(query)
            # Turn into something more manageable, and take only the first element.
            variable_definition = sc.dictize(results)[0]

            query = """
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                PREFIX dct: <http://purl.org/dc/terms/>
                PREFIX qb: <http://purl.org/linked-data/cube#>

                SELECT DISTINCT ?cl ?cl_label WHERE {{
                      <{URI}>   a               qb:CodedProperty .
                      BIND(qb:DimensionProperty AS ?type )
                      <{URI}>   qb:codeList     ?cl .
                      ?cl       rdfs:label      ?cl_label .
                }}""".format(URI=uri)

            codelist_results = sc.sparql(query)

            log.debug(codelist_results)

            if len(codelist_results) > 0 :
                codelist = sc.dictize(codelist_results)
                variable_definition['codelist'] = codelist

            log.debug(variable_definition)
            return jsonify(variable_definition)

        else:
            return 'error'

    else:
        return 'error'


@app.route('/codelist/concepts', methods=['GET'])
def codelist():
    """Gets the SKOS Concepts belonging to the SKOS Scheme or Collection identified by the URI parameter"""
    uri = request.args.get('uri', False)
    log.debug('Retrieving concepts for '+ uri)

    if uri:
        log.debug("Querying for SKOS concepts in Scheme or Collection <{}>".format(uri))

        query = """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX dct: <http://purl.org/dc/terms/>

            SELECT DISTINCT ?concept ?label ?notation WHERE {{
              {{ ?concept skos:inScheme <{URI}> . }}
              UNION
              {{ <{URI}> skos:member+ ?concept . }}
              ?concept skos:prefLabel ?label .
              OPTIONAL {{ ?concept skos:notation ?notation . }}
            }}
        """.format(URI=uri)

        lod_codelist = []
        sdh_codelist = []

        try:
            log.debug("Querying the LOD cloud cache")
            # First we go to the LOD cloud
            sparql = SPARQLWrapper('http://lod.openlinksw.com/sparql')
            sparql.setTimeout(1)
            sparql.setReturnFormat(JSON)
            sparql.setQuery(query)

            lod_codelist_results = sparql.query().convert()['results']['bindings']
            if len(lod_codelist_results) > 0:
                lod_codelist = sc.dictize(lod_codelist_results)
            else:
                lod_codelist = []

            log.debug(lod_codelist)
        except Exception as e:
            log.error(e)
            log.error('Could not retrieve anything from the LOD cloud')
            lod_codelist = []

        try:
            log.debug("Querying the SDH")
            # Then we have a look locally
            sdh_codelist_results = sc.sparql(query)
            if len(sdh_codelist_results) > 0:
                sdh_codelist = sc.dictize(sdh_codelist_results)
            else:
                sdh_codelist = []

            log.debug(sdh_codelist)

        except Exception as e:
            log.error(e)
            log.error('Could not retrieve anything from the SDH')

            sdh_codelist = []

        if lod_codelist == [] and sdh_codelist == []:
            return jsonify({'response': 'error', 'message': str(e)})
        else:
            return jsonify({'codelist': lod_codelist + sdh_codelist})


@app.route('/save', methods=['POST'])
def save():
    """Uses the DataCube converter to convert the JSON representation of variables to RDF DataCube"""

    req_json = request.get_json(force=True)
    variables = req_json['variables']
    dataset = req_json['file']
    dataset_path = req_json['path']
    profile = req_json['profile']

    source_hash = git_client.add_file(dataset_path, profile['name'], profile['email'])
    log.debug("Using {} as dataset hash".format(source_hash))

    dataset = datacube.converter.data_structure_definition(dataset, variables, profile, dataset_path, source_hash)

    data = util.inspector.update(dataset)
    socketio.emit('update', {'data': data}, namespace='/inspector')

    with open('latest_update.trig', 'w') as f:
        f.write(datacube.converter.serializeTrig(dataset))

    query = sc.make_update(dataset)
    result = sc.sparql_update(query)

    write_cache(dataset_path, variables)

    return result


@app.route('/browse', methods=['GET'])
def browse():
    """Takes a relative path, and returns a list of files/directories at that location as JSON"""
    path = request.args.get('path', None)

    if not path:
        raise Exception('Must specify a path!')

    log.debug('Will browse absolute path: {}/{}'.format(config.base_path, path))
    filelist, parent = fc.browse(config.base_path, path)

    return jsonify({'parent': parent, 'files': filelist})


def get_lsd_dimensions():
    """Loads the list of Linked Statistical Data dimensions (variables) from the LSD portal"""
    # TODO: Create a local copy that gets updated periodically

    try:
        if os.path.exists('metadata/dimensions.json'):
            log.debug("Loading dimensions from file...")
            with open('metadata/dimensions.json', 'r') as f:
                dimensions_json = f.read()

            dimensions = json.loads(dimensions_json)
        else:
            raise Exception("Could not load dimensions from file...")
    except:
        dimensions_response = requests.get("http://amp.ops.few.vu.nl/data.json")
        log.debug("Loading dimensions from LSD service...")
        try:
            dimensions = json.loads(dimensions_response.content)

            with open('metadata/dimensions.json', 'w') as f:
                f.write(dimensions_response)

        except:
            log.error("Dimensions could not be loaded from service...")

            dimensions = []

    return dimensions


def get_csdh_dimensions():
    """Loads the list of Linked Statistical Data dimensions (variables) from the CSDH"""

    query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX qb: <http://purl.org/linked-data/cube#>

        SELECT DISTINCT ?uri ?label ("CSDH" as ?refs) WHERE {
          {
              ?uri a qb:DimensionProperty .
              ?uri rdfs:label ?label .
          }
          UNION
          {
              ?uri a qb:MeasureProperty .
              ?uri rdfs:label ?label .
          }
          UNION
          {
              ?uri a qb:AttributeProperty .
              ?uri rdfs:label ?label .
          }
        }
    """
    sdh_dimensions_results = sc.sparql(query)
    if len(sdh_dimensions_results) > 0:
        sdh_dimensions = sc.dictize(sdh_dimensions_results)
    else:
        sdh_dimensions = []

    return sdh_dimensions


def get_csdh_schemes():
    """Loads SKOS Schemes (code lists) from the CSDH"""
    log.debug("Querying CSDH Cloud")

    query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX dct: <http://purl.org/dc/terms/>

        SELECT DISTINCT ?uri ?label WHERE {
          {
              ?c skos:inScheme ?uri .
              ?uri rdfs:label ?label .
          }
          UNION
          {
              ?uri skos:member ?c .
              ?uri rdfs:label ?label .
          }

        }
    """

    schemes_results = sc.sparql(query)
    schemes = sc.dictize(schemes_results)

    log.debug(schemes)

    return schemes


def get_schemes():
    """Loads SKOS Schemes (code lists) either from the LOD Cache, or from a cached copy"""
    if os.path.exists('metadata/schemes.json'):
        # TODO: Check the age of this file, and update if older than e.g. a week.
        log.debug("Loading schemes from file...")
        with open('metadata/schemes.json', 'r') as f:
            schemes_json = f.read()

        schemes = json.loads(schemes_json)
        return schemes
    else:
        log.debug("Loading schemes from RDF sources...")
        schemes = []

        ### ---
        ### Querying the LOD Cloud
        ### ---
        log.debug("Querying LOD Cloud")

        query = """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX dct: <http://purl.org/dc/terms/>

            SELECT DISTINCT ?scheme ?label WHERE {
              ?c skos:inScheme ?scheme .
              ?scheme rdfs:label ?label .
            }
        """

        sparql = SPARQLWrapper('http://lod.openlinksw.com/sparql')
        sparql.setReturnFormat(JSON)
        sparql.setQuery(query)

        results = sparql.query().convert()

        for r in results['results']['bindings']:
            scheme = {}

            scheme['label'] = r['label']['value']
            scheme['uri'] = r['scheme']['value']
            schemes.append(scheme)

        log.debug("Found {} schemes".format(len(schemes)))
        ### ---
        ### Querying the HISCO RDF Specification (will become a call to a generic CLARIAH Vocabulary Portal thing.)
        ### ---
        log.debug("Querying HISCO RDF Specification")

        query = """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX dct: <http://purl.org/dc/terms/>

            SELECT DISTINCT ?scheme ?label WHERE {
              ?scheme a skos:ConceptScheme.
              ?scheme dct:title ?label .
            }
        """

        g = Graph()
        g.parse('metadata/hisco.ttl', format='turtle')

        results = g.query(query)

        for r in results:
            scheme = {}
            scheme['label'] = r.label
            scheme['uri'] = r.scheme
            schemes.append(scheme)

        log.debug("Found a total of {} schemes".format(len(schemes)))

        schemes_json = json.dumps(schemes)

        with open('metadata/schemes.json', 'w') as f:
            f.write(schemes_json)

        return schemes
