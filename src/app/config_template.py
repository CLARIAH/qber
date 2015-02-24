# -*- coding: utf-8 -*-

## Copy this file to 'config.py' and make necessary changes for your local setup.

# Where should QBer look for your data file.
dataset = '<NAME OF DATASET>'
dataset_file = '<RELATIVE PATH TO JSON CONFIGURATION FOR DATASET>'

# SPARQL Endpoint Configuration
ENDPOINT_URL = '<URL OF SPARQL ENDPOINT>'
UPDATE_URL = '<URL OF SPARQL UPDATE ENDPOINT>'

# Stardog specific stuff
# (these are the default settings for HTTP Basic authenticating)
REASONING_TYPE = 'NONE'
AUTH = ('admin','admin')