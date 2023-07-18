import random
from flask import Flask, jsonify, redirect, render_template, request, url_for, request, session, make_response
from flask_session import Session
import mysql.connector
import redis
import bcrypt
from datetime import datetime, timedelta


def hash_password(password, salt=None):
    # Generate a salt value if not provided
    if not salt:
        salt = bcrypt.gensalt().decode('utf-8')

    # Hash the password with the provided salt
    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'), salt.encode('utf-8'))

    return hashed_password.decode('utf-8'), salt


def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def generate_year_array():
    year_array = []
    for i in range(2013, datetime.now().year + 1):
        year_array.append(i)
    return year_array[::-1]

def month_wise(query_result):
    month_wise_query_result = {"GUJ":[0,0,0,0,0,0,0,0,0,0,0,0], "CHN":[0,0,0,0,0,0,0,0,0,0,0,0], "DEL":[0,0,0,0,0,0,0,0,0,0,0,0], "KOL":[0,0,0,0,0,0,0,0,0,0,0,0], "MUM":[0,0,0,0,0,0,0,0,0,0,0,0], "PUN":[0,0,0,0,0,0,0,0,0,0,0,0]}
    for result in query_result:
        if result[5].month == 1:
            month_wise_query_result[(result[2])][0] += 1
        elif result[5].month == 2:
            month_wise_query_result[(result[2])][1] += 1
        elif result[5].month == 3:
            month_wise_query_result[(result[2])][2] += 1
        elif result[5].month == 4:
            month_wise_query_result[(result[2])][3] += 1
        elif result[5].month == 5:
            month_wise_query_result[(result[2])][4] += 1
        elif result[5].month == 6:
            month_wise_query_result[(result[2])][5] += 1
        elif result[5].month == 7:
            month_wise_query_result[(result[2])][6] += 1
        elif result[5].month == 8:
            month_wise_query_result[(result[2])][7] += 1
        elif result[5].month == 9:
            month_wise_query_result[(result[2])][8] += 1
        elif result[5].month == 10:
            month_wise_query_result[(result[2])][9] += 1
        elif result[5].month == 11:
            month_wise_query_result[(result[2])][10] += 1
        elif result[5].month == 12:
            month_wise_query_result[(result[2])][11] += 1

    return month_wise_query_result


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


# Connect to the PlanetScale MySQL query_resultbse

connection = mysql.connector.connect(
    host='aws.connect.psdb.cloud',
    user='hxajbpzbbegsei3k0dlc',
    passwd='pscale_pw_FWRWtnJU7FMLgFFgDXPOEz5i76i3NLxNQRWxtvnQsMF',
    db='trinity-crest_digitel',
    autocommit=True,
)

cursor = connection.cursor()


@app.route('/')
def home():
    return "up"


@app.route('/admin')
def admin():
    return f"Hello {session['username']}, from {session['circle']}. You are an {session['role']}"


@app.route('/incident-management')
def incident_management():
    if session.get('logged_in'):
        return render_template('incident_management.html', year_array=generate_year_array())

    return redirect(url_for('login'))


@app.route('/meter-reading')
def meter_reading():
    if session.get('logged_in'):
        return render_template('meter_reading.html')

    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if session.get('logged_in'):
            return jsonify({'message': 'Already logged in'}), 200
        request_query_result = request.get_json()
        email = request_query_result['email']
        password = request_query_result['password']

        cursor.execute(
            "SELECT user_password, user_salt FROM user_data WHERE user_email = %s;", (email,))
        user_query_result = cursor.fetchone()

        if user_query_result is None:
            return jsonify({'error': 'Invalid email or password'}), 401
        else:
            hashed_password = user_query_result[0]

            if verify_password(password, hashed_password):
                cursor.execute(
                    "SELECT user_name, user_circle, user_role, profile_picture_url FROM user_data WHERE user_email = %s;", (email,))
                user_query_result = cursor.fetchone()
                session['username'] = user_query_result[0]
                session['role'] = user_query_result[2]
                session['email'] = email
                session['profile_picture_url'] = user_query_result[3]
                session['logged_in'] = True
                return jsonify({'message': 'Login successful'}), 200
            else:
                return jsonify({'error': 'Invalid email or password'}), 401

    if session.get('logged_in'):
        if session['role'] == 'admin':
            return redirect(url_for('admin'))
        return redirect(url_for('incident_management'))
    return render_template('login.html')


# Needs to be added on the frontend

""" @app.route('/register', methods=['GET'])
def register():
    username = request.args.get('username')
    request.args.get('password')
    email = request.args.get('email')
    circle = request.args.get('circle')
    role = request.args.get('role')

    hashed_password, salt = hash_password(request.args.get('password'))

    cursor.execute("INSERT INTO user_query_result (user_name, user_password, user_salt, user_email, user_circle, user_role) VALUES (%s, %s, %s, %s, %s, %s);", (username, hashed_password, salt, email, circle, role))

    return redirect("/admin") """


@app.route('/logout')
def logout():
    if session.get('logged_in'):
        session.clear()
    return redirect(url_for('login'))


@app.route('/api/v1/incident-management')
def incident_management_api():
    if session.get('logged_in'):
        if request.args.get('year') is not None:
            try:
                circles = []
                mean_time_to_repair = {}
                year = request.args.get('year')
                cursor.execute("SELECT * FROM incident_records WHERE timestamp > %s AND timestamp < %s ORDER BY timestamp DESC;",
                               (datetime.strptime(year, "%Y"), datetime.strptime(str(int(year) + 1), "%Y")))
                query_result = cursor.fetchall()


                query_result = sorted(query_result, key=lambda x: x[5], reverse=True)

                for result in query_result:
                    if result[2] not in circles:
                        circles.append(result[2])

                for circle in circles:
                    number_of_incidents = 0
                    sum_of_repair_times = 0
                    for result in query_result:
                        if result[2] == circle:
                            number_of_incidents += 1
                            sum_of_repair_times += result[13]
                    mean_time_to_repair[circle] = int(
                        sum_of_repair_times / number_of_incidents)

                response = make_response(jsonify(
                    query_result, mean_time_to_repair, month_wise(query_result)), 200)
                response.headers.add('Cache-Control', 'private, max-age=3600')
                return response

            except Exception as e:
                return jsonify({'error': 'Invalid request', 'error_message': str(e)}), 400
        return jsonify({'error': 'Invalid request'}), 400
    return jsonify({'error': 'Not authorized'}), 401


@app.route('/api/v1/incident-management/<id>')
def incident_management_api_id(id):
    if session.get('logged_in'):
        if not id.isdigit():
            return jsonify({'error': 'Invalid incident id'}), 400
        cursor.execute(
            "SELECT * FROM incident_records WHERE incident_id = %s;", (id,))
        query_result = cursor.fetchone()
        if query_result is None:
            return jsonify({'error': 'Invalid incident id'}), 400
        return jsonify(query_result), 200
    return jsonify({'error': 'Not authorized'}), 401

@app.route('/api/v1/user/profile')
def user_profile_api():
    if session.get('logged_in'):
        query_result = {"user_name": session['username'],
                        "profile_picture_url": session['profile_picture_url']}
        return jsonify(query_result), 200
    return jsonify({'error': 'Not authorized'}), 401


@app.errorhandler(404)
def page_not_found(e):
    return render_template('under_construction.html'), 404


if __name__ == '__main__':
    app.run(debug=True)
