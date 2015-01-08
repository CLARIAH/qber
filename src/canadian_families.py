# -*- coding: utf-8 -*-

from savReaderWriter import SavReader
from csv import reader
from rdflib import Graph, Namespace, RDF, RDFS, OWL, Literal, URIRef
import urllib
import hashlib


VC = Namespace('http://data.clariah.ops.few.vu.nl/vocab/')
C = Namespace('http://data.clariah.ops.few.vu.nl/resource/')




SAV_SOURCE = "data/1901.sav"



def initialize_variables(g):
    variables = []
    with open('{}.variables'.format(SAV_SOURCE),'r') as variables_file:
        var_reader = reader(variables_file, delimiter=';', quotechar='\"')
        for line in var_reader:
            vname = line[0].strip()
            vlabel = line[1].strip()
            variables.append({'id': vname, 'label': vlabel})
        
            g.add((VC[vname],RDFS['label'],Literal(vlabel)))
        
        
    variables = list(enumerate(variables))
    
    return g, variables
    
def process(g, variables, line):
    # id is a compressed string of the contents of the line (allowing for roundtripping)
    id_string = hashlib.md5("".join([str(e) for e in line])).hexdigest()
    
    uri = C[id_string]

    for i,var in variables:
        rawval = line[i]
        
        if str(rawval).strip() != '':
            if isinstance(rawval,str):
                rawval = rawval.strip()
                val = C["{}/{}".format(var['id'],urllib.quote(rawval))]
                g.add((val,RDFS['label'],Literal(rawval)))
            else :
                val = Literal(rawval)
            
            g.add((uri, VC[var['id']], val))


    return g



def process_sav_file(g, variables):
    count = 0
    with SavReader(SAV_SOURCE, ioLocale='en_US.UTF-8') as savreader:
        
        for line in savreader:
            count += 1
            print "{}... ".format(count) ,
            g = process(g, variables, line)
            
    return g

def save_graph(g):
    output = "{}.turtle".format(SAV_SOURCE)
    outfile = open(output,'w')
    print "Writing to file....",
    g.serialize(outfile,format='nt')
    outfile.close()
    print "done"
    


if __name__ == '__main__':
    g = Graph()

    g.bind("vc",VC)
    g.bind("c",C)
    
    g, variables = initialize_variables(g)
    g = process_sav_file(g, variables)
    save_graph(g)