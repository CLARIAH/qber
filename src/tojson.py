import loader.reader
import requests
import json

adapter = loader.reader.go('loader/canada.json',0)

metadata = adapter.get_metadata()
reader = adapter.get_reader()

outfile = open('canada_data.json','w')
    
header = metadata.keys()

data = {}
for line in reader:
    
    line = [v.strip() if type(v) == str else v for v in line ]
    
    # Convert the line to a dictionary with keys from the header
    record = dict(zip(header, line))
    
    uuid_response = requests.get('http://127.0.0.1:5984/_uuids')
    uuid = json.loads(uuid_response.content)['uuids'][0]
    
    put_response = requests.put('http://127.0.0.1:5984/canada_1901/{}'.format(uuid),data=json.dumps(record))



