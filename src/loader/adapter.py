# -*- coding: utf-8 -*-

# TODO: Temporarily Disabled
# import os
# os.environ["DYLD_LIBRARY_PATH"] = "../lib/python2.7/site-packages/savReaderWriter/spssio/macos"

from collections import OrderedDict, defaultdict
# TODO: Temporarily Disabled
# from savReaderWriter import SavReader, SavHeaderReader
import csv
import pandas as pd



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

            with open(metadata_filename, "r") as metadata_file:
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
        """Checks whether the header in the file and the metadata provided are exactly the same"""
        if self.header and self.metadata:
            # Find the difference between header and metadata keys
            diff = set(self.header).difference(set(self.metadata.keys()))
            if len(diff) > 0:
                print "Header and metadata do *not* correspond"
                # print zip(self.header,self.metadata.keys())
                return False
            else :
                print "Header and metadata are aligned"
                return True
        else :
            print "No header or no metadata present"
            return False

    def get_values(self):
        """Return all unique values, and converts it to samples for each column."""

        # Get all unique values for each column
        stats = {}
        for col in self.data.columns:
            istats = []

            counts = self.data[col].value_counts()

            for i in counts.index:
                stat = {}
                stat['id'] = i
                stat['count'] = counts[i]
                istats.append(stat)


            stats[col] = istats

        return stats



# TODO: Temporarily Disabled
# class SavAdapter(Adapter):
#
#     def __init__(self, dataset):
#         super(SavAdapter, self).__init__(dataset)
#
#         if not dataset['format'] == 'SPSS':
#             raise Exception('This is an SPSS adapter, not {}'.format(dataset['format']))
#
#         self.filename = dataset['filename']
#
#         self.has_header = dataset['header']
#
#         self.reader = SavReader(self.filename, ioLocale='en_US.UTF-8')
#
#         if self.has_header:
#             with SavHeaderReader(self.filename, ioLocale='en_US.UTF-8') as hr:
#                 self.header = hr.varNames
#
#         else :
#             self.header = None
#
#         self.metadata = self.load_metadata()
#
#         print self.validate_header()
#         return
#
#     def get_examples(self):
#         """Returns first 10000 rows, and converts it to samples for each column."""
#
#         # Get first 10000 rows
#         rows = self.reader.head(10000)
#
#         # Assume metadata keys are best (since if no metadata exists, the header will be used to generate it)
#         header = self.metadata.keys()
#
#         # Convert the rows to a list of dictionaries with keys from the header
#         data_dictionaries = [dict(zip(header, [v.strip() if type(v) == str else v for v in values ])) for values in rows]
#
#         # Convert the list of dictionaries to a dictionary of sets
#         data = defaultdict(set)
#         for d in data_dictionaries:
#             for k, v in d.items():
#                 data[k].add(v)
#
#         json_ready_data = {}
#         for k,v in data.items():
#             json_ready_data[k] = list(v)[:250]
#
#         return json_ready_data


class CsvAdapter(Adapter):

    def __init__(self, dataset):
        """Initializes an adapter for reading a CSV dataset"""
        super(CsvAdapter, self).__init__(dataset)

        if not dataset['format'] == 'CSV':
            raise Exception('This is a CSV adapter, not {}'.format(dataset['format']))

        self.filename = dataset['filename']

        self.has_header = dataset['header']

        with open(self.filename, 'r') as fn:
            self.data = pd.DataFrame.from_csv(fn)

        if self.has_header:
            self.header = list(self.data.columns)
        elif self.metadata:
            self.header = self.metadata.keys()
        else:
            self.header = None

        self.metadata = self.load_metadata()

        print self.validate_header()
        return






mappings = {
    # "SPSS": SavAdapter,
    "CSV": CsvAdapter
}

def get_adapter(dataset):

    adapterClass = mappings[dataset['format']]
    adapter = adapterClass(dataset)

    return adapter
