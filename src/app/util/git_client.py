import app.config as config
from app import app
import sh
import os
import logging

DATA_PATH = config.base_path

log = app.logger
log.setLevel(logging.DEBUG)

def get_repository():
    log.debug("Baking git for {}".format(DATA_PATH))
    git = sh.git.bake(_cwd=DATA_PATH)

    try:
        log.debug("Get the status")
        git.status('.')
    except:
        log.debug("No status, no git repo")
        git.init('.')

    return git


def add_file(absolute_path, author, email):
    git = get_repository()

    # Get the relative path
    path = os.path.relpath(absolute_path, DATA_PATH)

    try:
        log.debug("Adding {}".format(path))
        git.add(path)
        log.debug("Added {}".format(path))
        log.debug("Committing")
        git.commit('--author=\"{} <{}>\"'.format(author, email), m="QBer commit by {} (<{}>)".format(author, email))
        log.debug("Committed")
    except Exception as e:
        log.warning("Nothing added (nothing changed?)")

    log.debug("Calling git ls-files to get sha hash for file {}".format(path))
    sha_hash = git('ls-files', '-s', absolute_path).split(' ')[1]
    log.debug("Got hash {}".format(sha_hash))
    return sha_hash
