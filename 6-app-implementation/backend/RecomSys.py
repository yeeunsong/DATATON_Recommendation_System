import random
import ast
import pandas as pd
import numpy as np
import re
import pickle
import pymysql
from numpy.linalg import svd
from scipy.sparse.linalg import svds

'''
Load Data Tables
'''
#connect to DB
db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                user='jhkwon@datacampus',
                password='datacampus12!',
                db='new_schema',
                charset='utf8')

cur = db.cursor(pymysql.cursors.DictCursor)

#Load User Table
cur = db.cursor(pymysql.cursors.DictCursor)
cur.execute("SELECT * FROM new_schema.user")
rows = cur.fetchall()
usertable = pd.DataFrame(rows)

# Load Lookup Table
cur = db.cursor(pymysql.cursors.DictCursor)
cur.execute("SELECT * FROM new_schema.lookup")
rows = cur.fetchall()
viewtable = pd.DataFrame(rows)

# Load Article table + 각 게싯물 마다 총 조회수 using lookup table
cur = db.cursor(pymysql.cursors.DictCursor)
cur.execute("SELECT new_schema.articles.articleid, title, description, tag, IFNULL(viewedcnts,0) as viewed\
            FROM new_schema.articles LEFT JOIN (SELECT articleid, sum(viewed) as viewedcnts\
            FROM new_schema.lookup\
            GROUP BY articleid) as viewcnt\
            ON viewcnt.articleid = new_schema.articles.articleid;")
rows = cur.fetchall()
data = pd.DataFrame(rows)

# User Table + 각 user마다 조회 횟수
cur = db.cursor(pymysql.cursors.DictCursor)
cur.execute("SELECT new_schema.user.userid, username, IFNULL(viewedcnts,0) as viewed\
            FROM new_schema.user LEFT JOIN (SELECT userid, sum(viewed) as viewedcnts\
            FROM new_schema.lookup\
            GROUP BY userid) as viewcnt\
            ON viewcnt.userid = new_schema.user.userid;")
rows = cur.fetchall()
userview = pd.DataFrame(rows)
userview.head()


'''
Simple Recommendation System
'''
def simpleRS(user_id):
    
    graded = {1: ['동아리', '친목', '연합'],
                2 : ['동아리','대외활동','봉사'],
                3 : ['대외활동', '봉사'],
                4 : ['학회', '스터디', '공모전']}


    sexd = {'F' : ['음악','예술', '언어'],
            'M' : ['운동', '음악', 'IT']}


    colleged = {'정보대학' : ['IT'],
                '정보보호학부' : ['IT'],
                '공과대학' : ['IT'],
                '이과대학' : ['IT'],
                '정경대학' :  ['경영', '대외활동'], 
                '경영대학' :  ['경영', '대외활동'], 
                '간호대학':['사회'], 
                '보건과학대학':['사회'],
                '국제학부' : ['언어'],
                '디자인조형학부' : ['예술'],
                '미디어학부' : ['경영', '대외활동', '예술', '음악'],
                '문과대학' : ['대외활동', '사회', '언어'] , 
                '사범대학' : ['대외활동', '사회', '언어'] ,
                '생명과학대학':['과학'], 
                '의과대학' : ['봉사','과학']}

    userinfo = usertable.loc[usertable.userid==user_id]
    selected = list(set(graded[userinfo.grade.iloc[0]]+sexd[userinfo.sex.iloc[0]]+colleged[userinfo.college.iloc[0]]))
    
    ## 사용자정보에 매핑하여 속하는 동아리 추출
    data_selected = data.loc[data.tag.apply(lambda y : any(x in y for x in selected))]
        
    ## 조회수별로 정렬
    selected_ordered = data_selected.sort_values(by='viewed', ascending=False)

    return list(selected_ordered.articleid)


'''
Content-based Filtering Recommendation System
'''
def cbf(userId,no_recom=10):
    #load cosine similarity matrix
    with open('cosine_sim.pkl','rb') as f:
        cosine_sim = pickle.load(f)
    
    #index에대한 제목
    names = data.title
    
    #조회한 동아리들에대한 cosine_sim 모두 더하기(조회수 2회이상이면 그만큼 곱하기)
    sim_scores=np.zeros(len(cosine_sim[0]))
    for n,i in enumerate(viewtable[viewtable['userid']==userId]['articleid']):
        sim_scores += (np.array(cosine_sim[i])*viewtable[viewtable['userid']==userId].reset_index()['viewed'][n])
    
    sim_scores = list(enumerate(sim_scores))
    #sim 높은순부터 정렬
    sim_scores = sorted(sim_scores, key = lambda x : x[1], reverse=True)
    res = [s[0] for s in sim_scores]
    tmp = []
    i=0
    while(len(tmp)<no_recom):
        if res[i] not in tmp:
            tmp.append(res[i])
        i+=1
    
    return tmp


'''
Collaborative Filtering Recommendation System
'''
def cf(user_id, num_recom=10):
    '''matrix factorization'''
    user_item = viewtable.pivot_table(values = 'viewed', index = 'userid', columns = 'articleid',dropna=False)
    user_item=user_item.fillna(0) #nan값 대신 0 으로 채우기

    U, sigma, Vt = svd(user_item)
    #find cumsum
    cumratio = list(map(lambda x : round(x,3), np.cumsum(sigma)/np.sum(sigma)))

    #80%의 설명력을 가지고 있는 요소들만 pick
    toleaveout = len(list(filter(lambda x : x<0.8, cumratio)))

    U, sigma, Vt = svds(user_item, k = toleaveout) #k=남길 특이값 개수

    sigma = np.diag(sigma)

    #convert back to original matrix by matrix multiplaction
    svd_pred = np.dot(np.dot(U,sigma),Vt)
    svd_pred = pd.DataFrame(svd_pred)

    
    '''Get 'mostly likely to view' articles'''
    #sort expected ratings
    sorted_index = svd_pred.loc[user_id].sort_values(ascending=False).index
    
    #get name list of clubs seen by user
    seen_clubs = svd_pred.columns[user_item.loc[user_id]!=0]
    
    #get index list of clubs seen by user
    seen_names = user_item.loc[user_id][user_item.loc[user_id]!=0].index
    seen_names = list(seen_names.unique())

    #get top n from movies user has not seen
    sorted_notseen = [x for x in sorted_index if x not in seen_clubs]
    recom_title = list(user_item.columns[sorted_notseen][:num_recom])

    return recom_title

'''
(Integrate Them All)
Hybrid Recommendation System
'''
def recommendation_system(user_id):
    userinfo = userview.loc[usertable.userid==user_id]
    notfirsttime=True
    
    if userinfo.viewed.iloc[0]<10:
        notfirsttime=False
        ratio = [1,0,0]
        
    elif userinfo.viewed.iloc[0]<20: ratio=[0.1,0.6,0.3]
    else: ratio=[0.1,0.3,0.6]
    
    
    result = dict()

    #simpleRS
    SRSres = simpleRS(user_id)
    for n,_ in enumerate(SRSres):
        if _ not in result.keys():
            result[_]=ratio[0]*(abs(n-len(SRSres))/len(SRSres)) #minmaxscalar inverted (ranking에 점수주기)
            
    #when 조회 less than 10, do not apply cbf and cf
    if notfirsttime:
        #cbf
        for _ in cbf(user_id):
            if _ in result.keys():
                result[_]+=ratio[1]
            else:
                result[_]=ratio[1]

        #cf
        for _ in cf(user_id):
            if _ in result.keys():
                result[_]+=ratio[2]
            else:
                result[_]=ratio[2]

    #sort by weight
    result = sorted(result.items(), key=lambda x: x[1],reverse=True)
    recommend = list([_[0] for _ in result])
    
    finalresult = []
    for _ in recommend:
        cur.execute('SELECT * FROM new_schema.articles WHERE articleid='+str(_))
        finalresult.append(cur.fetchone())
        
    return finalresult