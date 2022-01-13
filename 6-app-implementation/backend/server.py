import uuid
from datetime import datetime
from flask import Flask, request, abort, jsonify
import pymysql
import RecomSys
import tfidf
import pandas as pd
import sendtoschool
import lstmtag

app = Flask(__name__)


@app.route("/") #homepage
def hello():
    print(jsonify(rows))
    return jsonify(rows)


@app.route("/getitems/<userid>", methods=["GET"])
def getitems(userid):
    result = recommendation_system(userid)
    return jsonify(result)


@app.route("/register", methods=["POST"])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    grade = request.json.get('grade', None)
    sex = request.json.get('sex', None)

    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                    user='jhkwon@datacampus',
                    password='datacampus12!',
                    db='new_schema',
                    charset='utf8')

    #Get user table
    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM new_schema.user")
    rows = cur.fetchall()
    newid = len(rows)

    if username in list(pd.DataFrame(rows)['username']) or username is None: #if username already taken
        abort(401)
    else:
        #insert new user to db
        cur.execute('INSERT INTO new_schema.user VALUES(%s, %s, %s, %s, %s, %s)',(newid, username, password, grade, college, sex))
        db.commit()
        return jsonify({
            'status':'OK',
            'message':'successfully registered',
        })

#로그인
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                    user='jhkwon@datacampus',
                    password='datacampus12!',
                    db='new_schema',
                    charset='utf8')

    #Get user table
    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM new_schema.user")
    rows = cur.fetchall()

    if username not in list(pd.DataFrame(rows)['username']): #if not registered
        abort(401)
    else:
        #match password
        cur.execute('SELECT password FROM new_schema.user WHERE username=%s', username)
        realp = cur.fetchone()
        if realp['password']!=password: #if password not matching
            abort(401)
        else:
            cur.execute('SELECT userid FROM new_schema.user WHERE username=%s', username)
            userid = cur.fetchone()
            userid = userid['userid']
            return jsonify({
            'id':userid
        })


#게싯물 업로드
@app.route("/upload", methods=["POST"])
def upload():
    title = request.json.get('title', None)
    host = request.json.get('host', None)
    duedate = request.json.get('duedate', None)
    description = request.json.get('description', None)
    image = request.json.get('image',None)
    tags = request.json.get('tag', None)
    uploaderid = request.json.get('uploaderid', None)
    offlineupload = request.json.get('offlineupload', None)

    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                    user='jhkwon@datacampus',
                    password='datacampus12!',
                    db='new_schema',
                    charset='utf8')

    #Get article table
    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM new_schema.articles")
    rows = cur.fetchall()
    newid = len(rows)           

    uploaddate = datetime.now()
    #insert uploaded article to DB
    cur.execute('INSERT INTO new_schema.articles VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',(newid, title, host, uploaddate, duedate, description, image, tag, uploaderid, offlineupload))
    db.commit()
    return jsonify({
        'status':'OK',
        'message':'successfully registered',
    })

    #if uploaded, change TF-IDF matrix
    update_tfidf()

    #오프라인 게시=True이면 학교측으로 홍보물 정보를 보낸다
    if offlineupload:
        send_to_school(list(title, host, uploaddate, duedate, description, image, tag, uploaderid))


#LSTM으로 태그 제안
@app.route("/gethashtags",methods=["GET"])
def gethashtags(input_txt):
    tagcandidate = get_tags_lstm(input_txt) 
    return jsonify(tagcandidate)



#게싯물 click했을 때 조회 테이블에 추가하기
@app.route("/clicked", methods=["POST"])
def clicked(articleid, userid):
    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                user='jhkwon@datacampus',
                password='datacampus12!',
                db='new_schema',
                charset='utf8')

    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM lookup WHERE articleid="+str(articleid)+" and userid="+str(userid))
    row = cur.fetchall()

    if len(row)==0: 
        #처음 본 게싯물이라면 => 새로운 row 추가
        cur.execute("SELECT * FROM lookup")
        newid = len(cur.fetchall())
        cur.execute('INSERT INTO new_schema.lookup VALUES(%s, %s, %s, %s, %s)',(newid, userid, articleid, 1, 0))
        db.commit()
    else:
        #처음본게 아니라면 => 조회수 + 1
        cur.execute('UPDATE new_schema.lookup SET viewed='+str(row['view']+1)+" WHERE lookupid="+str(row['lookupid']))
        db.commit()



#스크랩버튼 누를 때 조회테이블에서 반대로 설정(1->0, 0->1)
@app.route("/scrap", methods=["POST"])
def scrap(userid, articleid):
    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                user='jhkwon@datacampus',
                password='datacampus12!',
                db='new_schema',
                charset='utf8')

    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM lookup WHERE articleid="+str(articleid)+" and userid="+str(userid))
    row = cur.fetchall()
    tochange = abs(row['scrapped']-1)
    cur.execute('UPDATE new_schema.lookup SET scrapped='+str(tochange)+" WHERE lookupid="+str(row['lookupid']))
    db.commit()


#내가 스크랩한 홍보물 가져오기
@app.route("/scraped/<userid>", methods=["GET"])
def scraped(userid):
    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                user='jhkwon@datacampus',
                password='datacampus12!',
                db='new_schema',
                charset='utf8')

    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT new_schema.articles.articleid, title, host, uploaddate, duedate, description, image, tag, uploaderid, offlineupload\
                FROM (SELECT * FROM new_schema.lookup\
                WHERE userid="+str(userid)+") as look LEFT JOIN new_schema.articles\
                ON look.articleid = new_schema.articles.articleid")
    scrapped = cur.fetchall()
    return jsonify(scrapped)


#내가 게시한 홍보물 가져오기
@app.route("/uploaded/<userid>", methods=["GET"])
def uploaded(userid):
    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                user='jhkwon@datacampus',
                password='datacampus12!',
                db='new_schema',
                charset='utf8')

    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM articles WHERE uploaderid="+str(userid))
    uploaded = cur.fetchall()
    return jsonify(uploaded)


if __name__=='__main__':
    app.run(debug=True) #tell flask to bind to any address with RN