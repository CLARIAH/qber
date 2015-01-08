from savReaderWriter import SavReader
from csv import reader

import logging
from app import app

log = app.logger
log.setLevel(logging.DEBUG)


def get_header(filename,type="csv",delimiter=';',quotechar='\"'):
    variables = []
    if type == "csv" :
        try :
            with open(filename,'r') as variables_file:
                var_reader = reader(variables_file, delimiter=delimiter, quotechar=quotechar)
            
                header = var_reader.next()
            
                for vname in header :
                    vname = vname.strip().encode('utf-8')
                    variables.append({'id': vname, 'label': vname})
        
        except Exception as e:
            log.error(e)
            raise e
    elif type == "sav" :
        try :
            with open('{}.variables'.format(filename),'r') as variables_file:
                var_reader = reader(variables_file, delimiter=';', quotechar='\"')
                for line in var_reader:
                    vname = line[0].strip().decode('utf-8')
                    vlabel = line[1].strip().decode('utf-8')
                    variables.append({'id': vname, 'label': vlabel})
        except Exception as e:
            log.error(e)
            raise e

    variables = list(enumerate(variables))
    
    return variables