# -*- coding: utf-8 -*-

import json
import adapter

def go(instructions_file, index=0):
    
    # Load JSON file containing instructions for converting data
    instructions = json.load(open(instructions_file,'r'))
    
    # The dataset at index in the instructions
    dataset = instructions['data'][index]
    print dataset
    
    # Get an adapter for the specified format
    a = adapter.get_adapter(dataset)
    
    return a
