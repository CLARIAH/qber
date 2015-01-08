# -*- coding: utf-8 -*-
from flask import render_template, g, request, jsonify, make_response, redirect, url_for, abort
from werkzeug.http import parse_accept_header
import logging
import requests
import json
from SPARQLWrapper import SPARQLWrapper, JSON

import config

from app import app

from util.file_client import get_header
import loader.reader

log = app.logger
log.setLevel(logging.DEBUG)

@app.route('/')
def index():
    adapter = loader.reader.go('loader/canada.json',0)
    
    variables = adapter.get_header()
    metadata = adapter.get_metadata()
    short_metadata = {metadata.keys()[0]: metadata[metadata.keys()[0]]}
    
    dimensions = get_dimensions()
    schemes = get_schemes()
    
    return render_template('variables.html', variables=variables, metadata=metadata, dimensions=json.dumps(dimensions), schemes=json.dumps(schemes))

def get_dimensions():
    
    dimensions_response = requests.get("http://amp.ops.few.vu.nl/data.json")
    dimensions = json.loads(dimensions_response.content)
    
    return dimensions

def get_schemes():
    schemes = []
    
    query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

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
    print schemes
        
    return schemes
        
    
