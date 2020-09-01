from flask import Flask, request, jsonify
import WebScraping_indeed as ind
from flask_cors import CORS

# declare constants
HOST = '0.0.0.0'
PORT = 8081

# initialize flask application
app = Flask(__name__)
CORS(app)

@app.route("/fetch_jobs", methods=['GET', 'POST'])
def fetch_jobs():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        fetched_data = ind.prepare_url(key_word=data['keyWord'], where=data['where'])
        if fetched_data.empty:
            return jsonify({"result": "0", "msg":"No jobs found for this choice"})

    return jsonify({"result": "1", "data": fetched_data.to_json()})
    
@app.route("/fetch_jobs1", methods=['GET', 'POST'])
def fetch_jobs1():
    if request.method == 'GET':
        print("test")

    return jsonify({"result": "1"})


if __name__ == '__main__':
    # run web server
    app.run(host=HOST,
            debug=True,  # automatic reloading enabled
            port=PORT)