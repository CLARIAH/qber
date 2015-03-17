# -*- coding: utf-8 -*-
import os 

base_path = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)),"../../data"))

# Where should QBer look for your data file.
dataset = 'utrecht_1829'
dataset_file = 'loader/utrecht.json'

# SPARQL Endpoint Configuration
ENDPOINT_URL = 'http://localhost:5830/qber/query'
UPDATE_URL = 'http://localhost:5830/qber/update'

# Stardog specific stuff
REASONING_TYPE = 'NONE'
AUTH = ('admin','admin')