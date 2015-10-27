# -*- coding: utf-8 -*-

## Copy this file to 'config.py' and make necessary changes for your local setup.
import os

base_path = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)),"<RELATIVE PATH TO DATA FOLDER>"))

# SPARQL Endpoint Configuration
ENDPOINT_URL = '<URL OF SPARQL ENDPOINT>'
UPDATE_URL = '<URL OF SPARQL UPDATE ENDPOINT>'

# Virtuoso specific stuff
CRUD_URL = '<CRUD URL>'
from requests.auth import HTTPDigestAuth
CRUD_AUTH = HTTPDigestAuth('<USER>', '<PASS>')

# Stardog specific stuff
# (these are the default settings for HTTP Basic authenticating)
REASONING_TYPE = 'NONE'
AUTH = ('admin','admin')
