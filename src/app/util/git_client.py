import app.config as config
import gevent.subprocess as sp

DATA_PATH = config.base_path


def add_file(absolute_path, author, email):
    out = sp.check_output(['python','app/util/git_command.py',DATA_PATH, absolute_path, author, email])

    return out.strip()
