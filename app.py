import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient
import certifi

ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.6yss5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.mureca

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


# 음악기록
@app.route("/music", methods=["POST"])
def music_post():
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']
    music_list = list(db.musics.find({}, {'_id': False}))
    count = len(music_list) + 1
    today = datetime.now()
    time = today.strftime('%Y.%m.%d')


    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')
    og_title = soup.select_one('meta[property="og:title"]')

    image = og_image['content']
    title = og_title['content'].split('-')[0]
    artist = og_title['content'].split('-')[1]

    doc = {
        'num': count,
        'title': title,
        'image': image,
        'comment': comment_receive,
        'artist': artist,
        'url': url_receive,
        'time': time,
        'like': 0
    }
    db.musics.insert_one(doc)

    return jsonify({'msg': '등록 완료!'})

@app.route("/music", methods=["GET"])
def music_get():
    music_list = list(db.musics.find({}, {'_id': False}))
    return jsonify({'musics':music_list})

# 게시글 삭제
@app.route("/music/done", methods=["POST"])
def music_done():
    num_receive = request.form['num_give']

    db.musics.delete_one({'num': int(num_receive)})
    # db.musics.update_one({'num':int(num_receive)}, {'$set': {'done': 1}})

    return jsonify({'msg': '삭제 완료!'})

# 검색
@app.route("/search", methods=["POST"])
def search_get():
    music_list = list(db.musics.find({}, {'_id': False}))
    return jsonify({'musics':music_list})

# 회원 탈퇴
@app.route('/withdrawal', methods=['POST'])
def sign_out():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        "username": username_receive,
        "password": password_hash,
    }
    db.users.delete_one(doc)
    return jsonify({'result': 'success'})

@app.route('/withdrawal')
def withdrawal():
    msg = request.args.get("msg")
    return render_template('out.html', msg=msg)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)