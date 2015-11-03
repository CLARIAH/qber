# -*- coding: utf-8 -*-
from flask import render_template, request, jsonify
from flask.ext.socketio import emit
from flask_swagger import swagger
from werkzeug.exceptions import HTTPException

import logging
import requests
import json
import os

import config
import util.inspector

from app import app, socketio

log = app.logger
log.setLevel(logging.DEBUG)




@app.route('/specs')
def specs():
    swag = swagger(app)
    swag['info']['version'] = "0.0.1"
    swag['info']['title'] = "CSDH API"
    swag['info']['description'] = "API for the CLARIAH Structured Data Hub"
    swag['host'] = "localhost:5000"
    swag['schemes'] = ['http']
    swag['basePath'] = '/'
    swag['swagger'] = '2.0'

    return jsonify(swag)


@app.route('/inspector')
def inspector():
    """
    Returns the Inspector Homepage
    ---
    tags:
        - Graph
    produces:
        - text/html
    responses:
        '200':
            description: Inspector homepage returned
        default:
            description: Unexpected error
            schema:
              $ref: "#/definitions/Error"
    """
    return render_template('inspector.html')


@app.route('/inspector/graph')
def inspector_graph():
    """
    Build a graph of dimensions, datasets and authors present in the CSDH
    ---
    tags:
        - Graph
    responses:
        '200':
            description: Graph generated
            schema:
                id: JSONGraph
                type: object
                properties:
                    directed:
                        type: boolean
                        description: Whether the graph is directed or not
                    multigraph:
                        type: boolean
                        description: Whether the graph is a multigraph or not
                    graph:
                        type: array
                        description: The graph details
                        items:
                            type: string
                    nodes:
                        type: array
                        description: The list of nodes in the graph
                        items:
                            description: A graph node
                            schema:
                                id: node
                                type: object
                                properties:
                                    origin:
                                        type: string
                                    type:
                                        type: string
                                    id:
                                        type: string
                                    name:
                                        type: string
                    links:
                        type: array
                        description: The list of edges in the graph
                        items:
                            type: string
                            schema:
                                id: link
                                type: object
                                properties:
                                    source:
                                        type: integer
                                        format: int32
                                    target:
                                        type: integer
                                        format: int32
        default:
            description: Unexpected error
            schema:
              $ref: "#/definitions/Error"
    """
    data = util.inspector.update()
    return jsonify(data)


# Socket IO handlers
@socketio.on('message', namespace='/inspector')
def message(json):
    log.debug('SocketIO message:\n' + str(json))



@app.after_request
def after_request(response):
    """
    Needed for Swagger UI
    """
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', "Authorization, Content-Type")
    response.headers.add('Access-Control-Expose-Headers', "Authorization")
    response.headers.add('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.add('Access-Control-Allow-Credentials', "true")
    response.headers.add('Access-Control-Max-Age', 60 * 60 * 24 * 20)
    return response
