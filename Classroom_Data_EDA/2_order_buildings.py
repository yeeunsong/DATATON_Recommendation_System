import re
import collections
from collections import Counter
import json
from itertools import groupby
from operator import itemgetter
from collections import defaultdict


f1 = open("most_visited_room.txt", "rt",  encoding='UTF8')
f2 = open("most_visited_building.txt", "w+", encoding='UTF-8-sig')


# most_visited_building.txt: 방문 빈도가 가장 높은 건물 찾기

Lines = f1.readlines()
items = []



for line in Lines:
    split_string = line.split(" ")
    place = split_string[0]
    place = re.sub('[\",]', '', place)
    place = re.sub('\[', '', place)
    place = re.sub('신공학과', '신공학관', place)
    place = re.sub('신공학관.*', '신공학관', place)
    place = re.sub('\(동관\).*', '(동관)', place)
    place = re.sub('미디어관.*', '미디어관', place)
    place = re.sub('의과대학본관.*', '의과대학본관', place)
    place = re.sub('이학관.*', '이학관', place)
    place = re.sub('본교대강당.*', '본교대강당', place)
    num = split_string[-1]
    num = re.sub(']\n', '', num)
    #print(place)

    items.append({"place":place, "num":int(num)})

result = defaultdict(int)
for d in items:
    result[d['place']] += int(d['num'])

# print(type(result))
# print(result)



result = {k: v for k, v in reversed(sorted(result.items(), key=lambda item: item[1]))}

for i in result.items():
    # print(i)
    f2.write(json.dumps(i, ensure_ascii=False))
    f2.write("\n")


f1.close()
f2.close()