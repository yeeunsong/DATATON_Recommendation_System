import pandas as pd
import re
import pickle
from konlpy.tag import Okt
from keras.preprocessing.sequence import pad_sequences
import tensorflow as tf

def get_tags_lstm(input_txt):
    tagindex = {'봉사': 0,
                '예술': 1,
                '사회': 2,
                'IT': 3,
                '공모전': 4,
                '경영': 5,
                '과학': 6,
                '미술': 7,
                '대외활동': 8,
                '기타': 9,
                '운동': 10,
                '취업': 11,
                '동아리': 12,
                '언어': 13,
                '친목': 14,
                '종교': 15,
                '스터디': 16,
                '연합': 17,
                '학회': 18,
                '음악': 19}

    okt = Okt()
    stopwords = pd.read_pickle('stopwords.pkl')

    #data cleanse
    def cleantxt(txt):
        if not pd.isnull(txt):
            txt = txt.replace('\n',' ')
            txt = txt.replace('\r','')
            txt = txt.replace('(',' ')
            txt = txt.replace(')',' ')
            p = re.compile(r'[A-Za-z가-힣?.!\'\ ]+')
            txt = ''.join(re.findall(p,txt))
            txt = re.sub(' +', ' ', txt).strip()
        return txt
    input_txt = cleantxt(input_txt)

    #tokenize
    X = []
    temp_X = []
    temp_X = okt.morphs(input_txt, stem=True) # 토큰화
    temp_X = [word for word in temp_X if not word in stopwords] # 불용어 제거
    X.append(temp_X)

    #Get trained tokenizer
    with open('tokenizer.pickle','rb') as f:
        tokenizer = pickle.load(f)
    X  = tokenizer.texts_to_sequences(X)
    maxlen = 150
    X = pad_sequences(X, padding='post', maxlen=maxlen)

    #Load Saved LSTM Model
    new_model = tf.keras.models.load_model('./model/model_3')
    pred = new_model.predict(X) #predict
    result=dict()
    for p in pred:
        for n, _ in enumerate(p):
            result[n]=_
    gettopfour = sorted(result.items(), key = lambda x: x[1], reverse=True)[:4]
    thres = []
    for a, b in gettopfour:
        if b>0.5:
            thres.append(a)

    final = []
    for _ in thres:
        final.append(list(tagindex.keys())[_])

    return final
    


