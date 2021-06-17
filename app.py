from flask import *
import boto3
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_Key'),
    aws_secret_access_key=os.getenv('S3_Secret'),
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=['POST'])
def upload():
    content = request.form.get('text')
    picFile = request.files.get('pic')
    s3.upload_fileobj(picFile, "first-time-test",
                      picFile.filename, ExtraArgs={'ACL': 'public-read'})
    return "success"


app.run(host="0.0.0.0", port=4000, debug=True)
