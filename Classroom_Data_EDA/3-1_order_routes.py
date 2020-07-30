import re
from collections import Counter
import json


f1 = open("class_data.txt", "rt",  encoding='UTF8')
f2 = open("most_used_routes.txt", "w+", encoding='UTF-8-sig')

Lines = f1.readlines()
id = []
dir = []
merge = []

del Lines[0]

for line in Lines:
    line = line[8:]
    f2.write(line)

f1.close()
f2.close()

"""
    id.append(x[2])
    dir.append(x[3:])
    merge.append({"id":x[2], "dir":x[3:]})



print((merge[2].get("dir")))
# dir: list in list
# id: str in list
# merge: dict in list
"""