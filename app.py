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
    filename = picFile.filename
    s3.upload_file(
        Bucket=os.getenv('S3_Bucket'),
        Filename=filename,
        Key='messageBoard/{}'.format(filename)
    )
    print(content, picFile, filename)
    return "success"


app.run(host="0.0.0.0", port=4000, debug=True)
