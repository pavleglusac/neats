import json

def encode(units):
    single_unit = None
    arr = []
    i = 0
    for unit in units:
        dictionary = dict([])
        data = unit.genome.get_data()
        dictionary[i] = data
        arr.append(dictionary)
        i += 1
    return json.dumps(arr)

def decode(data):
    pass
