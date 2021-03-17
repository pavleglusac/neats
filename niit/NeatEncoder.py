import json

unit_dict = {}

def encode(units):
    global unit_dict
    unit_dict = {}
    single_unit = None
    arr = []
    i = 0
    for unit in units:
        dictionary = dict([])
        data = unit.genome.get_data()
        unit.set_id(i)
        dictionary[i] = data
        unit_dict[i] = unit
        arr.append(dictionary)
        i += 1
    return json.dumps(arr)

def decode_data(data):
    s = ""
    for i in data.keys():
        s += i
    print(s)
    data = s
    data = data.split(";")
    data.pop(-1)
    for entry in data:
        entry = entry.split(":")
        id = int(entry[0])
        score = int(entry[1])
        unit_dict[id].score = score

