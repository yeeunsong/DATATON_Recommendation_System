import re
from collections import Counter
import json


"""
global variables
"""
cl = [[] for _ in range(50000)]
class_index = -1
routes = []

"""
functions
"""

def sortFunction(value):
    return value["time"]


def new_classes(class_list):
    global class_index
    global cl
    class_index += 1
    #cl[class_index] = []
    # std_list: cl[class_index] element

    std_list = [[], [], [], [], [], [], []]
    for x in class_list:
        split = x.split(" ")
        if len(split) != 1:
            std_list = swith_days(split[0][0], split, std_list)
    cl[class_index] = std_list



def same_classes(class_list):
    global class_index
    global cl
    std_list = cl[class_index]

    for x in class_list:
        split = x.split(" ")
        if len(split)!=1:
            std_list = swith_days(split[0][0], split, std_list)
    cl[class_index] = std_list


def swith_days(day_str, split, std_list):
    if split[0][2:-1]!='':
        if day_str == '월':
            std_list[0].append((split[0][2:-1], split[1]))

        elif day_str == '화':
            std_list[1].append((split[0][2:-1], split[1]))

        elif day_str == '수':
            std_list[2].append((split[0][2:-1], split[1]))

        elif day_str == '목':
            std_list[3].append((split[0][2:-1], split[1]))

        elif day_str == '금':
            std_list[4].append((split[0][2:-1], split[1]))

        elif day_str == '토':
            std_list[5].append((split[0][2:-1], split[1]))

        elif day_str == '일':
            std_list[6].append((split[0][2:-1], split[1]))

    return std_list


def system(self):
    return cl


def cal_routes():
    global routes
    global cl
    route_index=0

    # cl: all text
    # element: 1 student class info
    # i: student class info in a day (ex>Mon)
    # index: 1 class
    for element in cl:
        for i in element:
            class_time=-1 # start of a new day
            for index in i:
                if int(index[0][0])==int(class_time)+1:
                   routes.append(class_place+":"+index[1])
                class_time = index[0][-1]
                class_place = index[1]


def remove_null_places():
    global routes
    new_routes = []
    for line in routes:
        x = line.split(":")
        if not (x[0] == '' or x[1] == ''):
            new_routes.append(line)

    routes = new_routes

    """
    print("before: "+ str(len(routes)))
    routes = {k: v for k, v in routes.items() if v and v.strip()}
    routes = {k: v for k, v in routes.items() if k and k.strip()}
    print("after: " + str(len(routes)))
    # used when routes is a dictionary
    # changed routes data structure to list, not dict
    """













"""
__main__
"""

def main():


    f1 = open("most_used_routes.txt", "rt",  encoding='UTF8')
    f2 = open("most_used_routes_2.txt", "w+", encoding='UTF-8-sig')
    f3 = open("most_used_routes_3.txt", "w+", encoding='UTF-8-sig')

    Lines = f1.readlines()
    id = []

    index=0



    for line in Lines:
        line = re.sub('\n','',line)
        line = re.sub('신공학과', '신공학관', line)
        line = re.sub('신공학관.*', '신공학관', line)
        line = re.sub('\(동관\).*', '(동관)', line)
        line = re.sub('\(서관\).*', '(서관)', line)
        line = re.sub('미디어관.*', '미디어관', line)
        line = re.sub('국제관.*', '국제관', line)
        line = re.sub('의과대학본관.*', '의과대학본관', line)
        line = re.sub('이학관.*', '이학관', line)
        line = re.sub('본교대강당.*', '본교대강당', line)
        x = line.split("|")
        id.append(x[0])

        if index!=0:
            if id[index]!=id[index-1]:
                new_classes(x[1:])
            else:
                same_classes(x[1:])
        else:
            new_classes(x[1:]) # index is zero

        index = index+1

    for element in cl:
        for i in element:
            i.sort(key=lambda v: int(v[0].split("-")[0]))


    for element in cl:
        f2.write(json.dumps(element, ensure_ascii=False))
        f2.write("\n")

    cal_routes()
    remove_null_places()
    # print(routes)

    merged = Counter(routes)
    merged = merged.most_common() # sort by values

    print(merged)

    for i in merged:
        f3.write(json.dumps(i, ensure_ascii=False))
        f3.write("\n")
    """
    # case when merged type is collections counter
    # changed to list by using most_common(
    for key, value in merged.items():
        # print(type(i))
        f3.write(json.dumps((key, value), ensure_ascii=False))
        f3.write("\n")

    print(merged)
    print(type(merged))
    """



    f1.close()
    f2.close()
    f3.close()





# Main function calling
if __name__=="__main__":
    main()