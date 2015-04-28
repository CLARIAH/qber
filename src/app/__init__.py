# -*- coding: utf-8 -*-

from flask import Flask
from flask.ext.socketio import SocketIO
from flask_bootstrap import Bootstrap

app = Flask(__name__)
Bootstrap(app)
app.debug = True

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

import views