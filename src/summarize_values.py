import loader.reader
import requests
import json

adapter = loader.reader.go('loader/canada.json',0)

metadata = adapter.get_metadata()
reader = adapter.get_reader()


    
header = metadata.keys()

data = {}

for k in header:
    data[k] = set()

MAX = 10000
count = 0
for line in reader:
    if count > MAX :
        break

    line = [v.strip() if type(v) == str else v for v in line ]
    
    # Convert the line to a dictionary with keys from the header
    record = dict(zip(header, line))
    
    for k in header:
        data[k].add(record[k])
    
    count += 1
    
for k in header:
    data[k] = list(data[k])
    
with open('canada_values.json','w') as outfile:
    outfile.write(json.dumps(data))