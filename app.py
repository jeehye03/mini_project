
from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for

from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup



client = MongoClient('mongodb://3.34.44.93', 27017, username="sparta", password="woowa")

db = client.dbsparta_plus_week4
db1 = client.mureca

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

SECRET_KEY = 'SPARTA'


@app.route('/')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

@app.route('/login')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        return render_template('index.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
         'id': username_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 1)  # 로그인 1시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,
        "password": password_hash,

    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})



@app.route("/music", methods=["POST"])
def music_post():
    title_receive = request.form['title_give']
    url_receive = request.form['url_give']
    artist_receive = request.form['artist_give']

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    image = soup.select_one('meta[property="og:image"]')['content']


    doc = {
        'title':title_receive,
        'image':image,
        'artist':artist_receive
    }
    db1.musics.insert_one(doc)

    return jsonify({'msg':'등록 완료!'})

@app.route("/music", methods=["GET"])
def music_get():
    music_list = list(db1.musics.find({}, {'_id': False}))
    return jsonify({'musics':music_list})

@app.route("/search", methods=["POST"])
def search_get():
    music_list = list(db1.musics.find({}, {'_id': False}))
    return jsonify({'musics':music_list})







if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)