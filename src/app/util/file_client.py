# from savReaderWriter import SavReader
from csv import reader
from glob import glob
import logging
import os


from app import app

log = app.logger
log.setLevel(logging.DEBUG)


# def get_header(filename,type="csv",delimiter=';',quotechar='\"'):
#     variables = []
#     if type == "csv" :
#         try :
#             with open(filename,'r') as variables_file:
#                 var_reader = reader(variables_file, delimiter=delimiter, quotechar=quotechar)
#
#                 header = var_reader.next()
#
#                 for vname in header :
#                     vname = vname.strip().encode('utf-8')
#                     variables.append({'id': vname, 'label': vname})
#
#         except Exception as e:
#             log.error(e)
#             raise e
#     elif type == "sav" :
#         try :
#             with open('{}.variables'.format(filename),'r') as variables_file:
#                 var_reader = reader(variables_file, delimiter=';', quotechar='\"')
#                 for line in var_reader:
#                     vname = line[0].strip().decode('utf-8')
#                     vlabel = line[1].strip().decode('utf-8')
#                     variables.append({'id': vname, 'label': vlabel})
#         except Exception as e:
#             log.error(e)
#             raise e
#
#     variables = list(enumerate(variables))
#
#     return variables


def browse(parent_path, relative_path):
    import magic
    absolute_path = os.path.join(parent_path, relative_path)
    log.debug('Browsing {}'.format(absolute_path))
    files = glob("{}/*".format(absolute_path))

    filelist = []
    for p in files:
        (pth, fn) = os.path.split(p)

        mimetype = magic.from_file(p, mime=True)

        if mimetype == "text/plain" and (fn[-3:] == "ttl" or fn[-2:] == 'n3'):
            mimetype = "text/turtle"
        if mimetype == "text/plain" and (fn[-3:] == "owl" or fn[-2:] == 'rdf'):
            mimetype = "application/rdf+xml"

        if os.path.isdir(p):
            filetype = 'dir'
        else:
            filetype = 'file'

        relative_p = os.path.relpath(p, parent_path)

        filelist.append({'label': fn, 'uri': relative_p, 'mimetype': mimetype, 'type': filetype})

    # Absolute parent is the absolute path of the parent of the current absolute path
    absolute_parent = os.path.abspath(os.path.join(absolute_path, os.pardir))
    # The relative parent is the relative path of the parent
    relative_parent = os.path.relpath(absolute_parent, parent_path)

    log.debug("base path " + parent_path)
    log.debug("absolute parent " + absolute_parent)
    log.debug("relative parent " + relative_parent)
    log.debug("constructed parent " + os.path.abspath(os.path.join(parent_path, '..')))

    if absolute_parent == os.path.abspath(os.path.join(parent_path, '..')) or '..' in relative_parent:
        print absolute_parent, relative_parent
        relative_parent = ''


    return filelist, relative_parent
