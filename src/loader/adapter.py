# -*- coding: utf-8 -*-

import os
os.environ["DYLD_LIBRARY_PATH"] = "../lib/python2.7/site-packages/savReaderWriter/spssio/macos"

from collections import OrderedDict
from savReaderWriter import SavReader, SavHeaderReader
import csv




class Adapter(object):
    def __init__(self, dataset):
        self.dataset = dataset
        
        return
    
    def get_reader(self):
        return self.reader
        
    def get_header(self):
        return self.header
        
    def get_metadata(self):
        if self.metadata:
            return self.metadata
        else :
            return None
        
    def load_metadata(self):
        metadata = OrderedDict()
        
        if 'metadata' in self.dataset:
            print "Loading metadata..."
            metadata_filename = self.dataset['metadata']
        
            metadata_file = open(metadata_filename,"r")
            metadata_reader = csv.reader(metadata_file,delimiter=";",quotechar="\"")
    
            
    
            for l in metadata_reader:
                metadata[l[0].strip()] = l[1].strip()

        elif self.header :
            print "No metadata... reconstructing from header"
            for h in self.header:
                metadata[h] = h
        else :
            print "No metadata or header"

        return metadata
    
    def validate_header(self):
        if self.header and self.metadata:
            # Find the difference between header and metadata keys
            diff = set(self.header).difference(set(self.metadata.keys()))
            if len(diff) > 0:
                print "Header and metadata do *not* correspond"
                print zip(self.header,self.metadata.keys())
                return False
            else :
                print "Header and metadata are aligned"
                return True
        else :
            print "No header or no metadata present"
            return False


class SavAdapter(Adapter):
    
    def __init__(self, dataset):
        super(SavAdapter, self).__init__(dataset)
        
        if not dataset['format'] == 'SPSS':
            raise Exception('This is an SPSS adapter, not {}'.format(dataset['format']))
            
        self.filename = dataset['filename']
        
        self.has_header = dataset['header']
        
        self.reader = SavReader(self.filename, ioLocale='en_US.UTF-8')
        
        if self.has_header:
            self.header = SavHeaderReader(self.filename, ioLocale='en_US.UTF-8').varNames
        else :
            self.header = None
            
        self.metadata = self.load_metadata()
        
        print self.validate_header()
        return
    

    
class CsvAdapter(Adapter):
    
    def __init__(self,dataset):
        super(CsvAdapter, self).__init__(dataset)
        
        if not dataset['format'] == 'CSV':
            raise Exception('This is a CSV adapter, not {}'.format(dataset['format']))
        
        self.filename = dataset['filename']
        
        self.has_header = dataset['header']
        
        self.reader = csv.reader(open(self.filename,'r'))

        if self.has_header :
            self.header = next(self.reader)
        elif self.metadata :
            self.header = self.metadata.keys()
        else :
            self.header = None
            
        self.metadata = self.load_metadata()
            
        print self.validate_header()
        return
        

mappings = {
    "SPSS": SavAdapter,
    "CSV": CsvAdapter
}

def get_adapter(dataset):

    adapterClass = mappings[dataset['format']]
    adapter = adapterClass(dataset)
    
    return adapter
    
