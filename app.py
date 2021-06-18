from flask import *
# import boto3
import pymysql
import threading
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
# s3 = boto3.client(
#     's3',
#     aws_access_key_id=os.getenv('S3_Key'),
#     aws_secret_access_key=os.getenv('S3_Secret'),
# )

# table=content -> id(int),picture(varchar),message(varchar)
conn = pymysql.connect(
    host=os.getenv('RDS_Host'), user=os.getenv('RDS_User'), password=os.getenv('RDS_Password'), database="Message")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/download")
def download():
    try:
        mycursor = conn.cursor()
        conn.ping(reconnect=True)
        thread_lock = threading.Lock()
        thread_lock.acquire()
        sql = "select picture,message from content"
        mycursor.execute(sql)
        myresult = mycursor.fetchall()
        result = []
        for x in myresult:
            y = {
                "pic": x[0],
                "text": x[1]
            }
            result.append(y)
        conn.close()
        thread_lock.release()
        return jsonify({"data": result})
    except:
        return jsonify({"error": True})


@app.route("/upload", methods=['POST'])
def upload():
    try:
        content = request.form.get('text')
        picFile = request.files.get('pic')
        # s3.upload_fileobj(picFile, "first-time-test",
        #                   picFile.filename, ExtraArgs={'ACL': 'public-read'})
        cdnPath = "http://d1ggvmbnmq1itc.cloudfront.net/"+picFile.filename
        mycursor = conn.cursor()
        conn.ping(reconnect=True)
        thread_lock = threading.Lock()
        thread_lock.acquire()
        sql = "insert into content(picture,message) values('%s','%s')" % (
            cdnPath, content)
        mycursor.execute(sql)
        conn.commit()
        thread_lock.release()
        return jsonify({"ok": True})
    except:
        return jsonify({"error": True})


app.run(host="0.0.0.0", port=4000, debug=True)
