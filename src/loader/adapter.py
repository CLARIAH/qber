from savReaderWriter import SavReader

mappings = {
    "SPSS": SavReader    
}

def get_reader(format):
    try:
        return mappings[format]
    except Exception as e:
        raise Exception("Format unknown, no reader found")