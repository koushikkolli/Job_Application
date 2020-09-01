
from flask import Flask, request, jsonify, json
from flask_cors import CORS
import WebScraping as ind

BASE_URL="http://localhost:92/"
app = Flask(__name__)
CORS(app)
app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


@app.route('/', methods=['GET'])
def sql_start():
    return "Welcome to Query Migration "

@app.route('/fetch_indeed', methods=['GET', 'POST'])
def fetch_indeed():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        fetched_data = ind.prepare_url_indeed(key_word=data["keyWord"], where=data["where"])
        return json.dumps([ob.__dict__ for ob in fetched_data])
    else:
        return 'Please use POST Method with Search Query as Paramater'

@app.route('/fetch_linkedin', methods=['GET', 'POST'])
def fetch_linkedin():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        fetched_data = ind.prepare_url_linkedin(key_word=data["keyWord"], where=data["where"])
        return json.dumps([ob.__dict__ for ob in fetched_data])
    else:
        return 'Please use POST Method with Search Query as Paramater'

"""@app.route('/fetch_doccafe', methods=['GET', 'POST'])
def fetch_doccafe():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        fetched_data = ind.prepare_url_doccafe(key_word=data["keyWord"], where=data["where"])
        return json.dumps([ob.__dict__ for ob in fetched_data])
    else:
        return 'Please use POST Method with Search Query as Paramater' """

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=91)
