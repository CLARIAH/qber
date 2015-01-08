import json
import adapter

def go():
    
    # Load JSON file containing instructions for converting data
    instructions = json.load(open("loader/canada.json",'r'))
    
    # For each dataset mentioned in the instructions
    for dataset in instructions['data']:
        # Get a reader for the specified format
        reader = adapter.get_reader(dataset['format'])
        
        # Run through file, and perform conversion.
        with reader(dataset['file']) as r:
            for line in r:
                print line
    