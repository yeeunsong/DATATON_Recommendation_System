import re
from collections import Counter
import json

f1 = open("class_data.txt", "rt",  encoding='UTF8')
f2 = open("most_visited_rooms.txt", "w+", encoding='UTF-8-sig')


# class_data.txt: 제공받은 수업 데이터
# most_visited_building.txt: 방문 빈도가 가장 높은 건물 찾기

Lines = f1.readlines()
dir = []
#class_data.txt file의 모든 텍스트 읽기



for line in Lines:
    place = re.sub(r'^.*?=|', '', line)
    place = re.sub('\([0-9]\) ', '', place)
    place = re.sub('\([0-9][0-9]\) ', '', place)
    place = re.sub('\([0-9]-[0-9]\) ', '', place)
    place = re.sub('\([0-9]-[0-9][0-9]\) ', '', place)
    place = re.sub('[월화수목금토일]', '', place)
    place = re.sub('미정', '', place)
    place = re.sub('\n', '', place)
    place = re.sub('하나과학관\s지하', '하나과학관지하', place)
    place = re.sub('의대\s제', '의대제', place)
    #place = re.sub('[0-9][0-9][0-9]호', '', place)
    dir.append(place)


# print(dir)
build = []
for line in dir:
    x = line.split('|')
    # print(x)
    for i in x:
        build.append(i)

build.remove("")
result = Counter(build)

print(result)


result = {k: v for k, v in reversed(sorted(result.items(), key=lambda item: item[1]))}

for i in result.items():
    print(i)
    f2.write(json.dumps(i, ensure_ascii=False))
    f2.write("\n")

f1.close()
f2.close()