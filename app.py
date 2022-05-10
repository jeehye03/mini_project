from flask import Flask, render_template, request, jsonify
app = Flask(__name__)


from pymongo import MongoClient
import certifi

ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.6yss5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')


@app.route("/modal", methods=["GET"])
def modal_get():

    modal_list = list(db.musics.find({}, {'_id': False}))

    return jsonify({'modals':modal_list})

@app.route("/comment", methods=["POST"])
def comment_post():
    comment_receive = request.form['comment_give']

    db.comment.insert_one({'comment':comment_receive})

    return jsonify({'msg':'댓글 등록 성공!'})

@app.route("/comment", methods=["GET"])
def comment_get():

    comment_list = list(db.comment.find({}, {'_id': False}))
    return jsonify({'comments':comment_list})

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)