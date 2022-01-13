from konlpy.tag import Komoran
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import re

def update_tfidf():
    db = pymysql.connect(host='datacampus.mysql.database.azure.com',
                    user='jhkwon@datacampus',
                    password='datacampus12!',
                    db='new_schema',
                    charset='utf8')

    #Get article table
    cur = db.cursor(pymysql.cursors.DictCursor)
    cur.execute("SELECT * FROM new_schema.articles")
    rows = cur.fetchall()
    data = pd.DataFrame(rows)

    #integrate title and description
    data['txt'] = data['title']+data['description']

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

    data['txt'] = data['txt'].apply(cleantxt)

    ###Calculate TFIDF Matrix###
    stopwords = pd.read_pickle('stopwords.pkl') #불용어 불러오기
    stopwords = list(stopwords)

    #tokenizing
    komo = Komoran() #어미/어근의 분류가 잘 되어있다 판단.

    class Tokenize:
        def __init__(self):
            pass
        def __call__(self, text):
            #stemming
            #어미 관련 모두 제외
            stemmed = [_ for _ in komo.pos(text) if _[1] not in ['EC', 'EF', 'EP', 'ETM', 'ETN']]
            
            #lemmatizing
            #VV=동사어근, VA=형용사어근
            lemma = [_[0]+'다' if (_[1]=='VA') or (_[1]=='VV') else _[0] for _ in stemmed]
            
            #remove stopwords
            tokens = [_ for _ in lemma if _ not in stopwords]
            
            return tokens
        
    tokenize = Tokenize()

    #객체 생성
    tfidf = TfidfVectorizer(tokenizer = tokenize,
                            analyzer = 'word', ngram_range=(1,2), 
                            min_df=0) #ngram, stopwords 기능 지원

    tfidf_matrix = tfidf.fit_transform(data['txt'])



    #Get cosine similarity between articles using TFIDF matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix) #linear_kernel = dot product

    with open('cosine_sim.pkl','wb') as f:
        pickle.dump(cosine_sim, f)