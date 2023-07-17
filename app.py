import random
from flask import Flask, flash, jsonify, redirect, render_template, request, url_for, abort, request, session
from flask_session import Session
import mysql.connector
import redis

app = Flask(__name__)
app.secret_key = "mysecrckmk;cm;etkey"  # To sign the user session cookies

# Redis Session Configuration
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_COOKIE_NAME'] = 'X-Identity'
app.config['SESSION_COOKIE_DOMAIN'] = '.projectrexa.ml'
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_REDIS'] = redis.from_url(
    'redis://default:40RX7WwPMtFGpp3vvflizudm2ISdhAEm@redis-11234.c8.us-east-1-4.ec2.cloud.redislabs.com:11234')

server_session = Session(app)



# Connect to the PlanetScale MySQL Databse

connection = mysql.connector.connect(
    host='aws.connect.psdb.cloud',
    user='hxajbpzbbegsei3k0dlc',
    passwd='pscale_pw_FWRWtnJU7FMLgFFgDXPOEz5i76i3NLxNQRWxtvnQsMF',
    db='trinity-crest_digitel',
    autocommit=True,
)

cursor = connection.cursor()

cursor.execute("SHOW TABLES;")
tables = cursor.fetchall()
print(tables)


@app.route('/')
def home():
    return redirect("/admin")


@app.route('/<page_name>')
def render_static(page_name):
    try:
        return render_template('%s.html' % page_name)
    except:
        abort(404)


@app.route('/incident-management')
def incident_management():
    return render_template('incident_management.html')


@app.route('/meter-reading')
def meter_reading():
    return render_template('meter_reading.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])

@app.errorhandler(404)
def page_not_found(e):
    return render_template('under_construction.html'), 404


if __name__ == '__main__':
    app.run(debug=True)
