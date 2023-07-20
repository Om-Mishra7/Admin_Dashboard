
import copy
from flask import (
    Flask,
    jsonify,
    redirect,
    render_template,
    request,
    url_for,
    request,
    session,
    make_response,
    send_from_directory,
)
from flask_session import Session
import mysql.connector
import redis
from datetime import datetime
from prediction import prediction
from helper_functions import verify_password, generate_year_array, sort_month_wise
import os
from dotenv import load_dotenv

load_dotenv(".env")  # Load environment variables from .env file

app = Flask(__name__)
# To sign the user session cookies
app.secret_key = "}<va[jCw~d0U=m:w^K//aqi2rPlC3t3gv=dZ]#Nd-~cU->'-R]/2iDy]XaLpolz"

# Redis Session Configuration
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_NAME"] = "X-Identity"
app.config["SESSION_COOKIE_DOMAIN"] = os.getenv("session_cookie_domain")
app.config["SESSION_COOKIE_PATH"] = "/"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_REDIS"] = redis.from_url(
    f"redis://{os.getenv('redis_username')}:{os.getenv('redis_password')}@redis-15259.c264.ap-south-1-1.ec2.cloud.redislabs.com:15259"
)

server_session = Session(app)


# Connect to the PlanetScale MySQL query_resultbse

connection = mysql.connector.connect(
    host="aws.connect.psdb.cloud",
    user=os.getenv("planetscale_username"),
    passwd=os.getenv("planetscale_password"),
    db=os.getenv("planetscale_db"),
    autocommit=True,
)

cursor = connection.cursor()


@app.after_request
def add_header(response):
    response.headers[
        "Strict-Transport-Security"
    ] = "max-age=31536000; includeSubDomains"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "private, max-age=3600"
    response.headers["server"] = "Trinity"

    return response


@app.route("/")
@app.route("/dashboard")
def home():
    if session.get("logged_in"):
        response = make_response(redirect(url_for("incident_management")), 200)
        return response


@app.route("/incident-management")
def incident_management():
    if session.get("logged_in"):
        response = make_response(
            render_template(
                "incident_management.html", year_array=generate_year_array()
            ),
            200,
        )
        return response

    return redirect(url_for("login"))


@app.route("/meter-reading")
def meter_reading():
    if session.get("logged_in"):
        response = make_response(
            render_template("meter_reading.html", year_array=generate_year_array()), 200
        )
        return response

    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":

        if session.get("logged_in"):
            response = make_response(jsonify({"message": "Already logged in"}), 200)
            return response

        request_query_result = request.get_json()
        email = request_query_result["email"]
        password = request_query_result["password"]

        cursor.execute(
            "SELECT user_password, user_salt FROM user_data WHERE user_email = %s;",
            (email,),
        )
        user_query_result = cursor.fetchone()

        if user_query_result is None:
            response = make_response(
                jsonify({"error": "Invalid email or password"}), 401
            )
            return response

        else:
            hashed_password = user_query_result[0]

            if verify_password(password, hashed_password):
                cursor.execute(
                    "SELECT user_name, user_circle, user_role, profile_picture_url FROM user_data WHERE user_email = %s;",
                    (email,),
                )
                user_query_result = cursor.fetchone()
                session["username"] = user_query_result[0]
                session["role"] = user_query_result[2]
                session["email"] = email
                session["profile_picture_url"] = user_query_result[3]
                session["logged_in"] = True
                response = make_response(jsonify({"message": "Login successful"}), 200)
                return response

            else:
                response = make_response(
                    jsonify({"error": "Invalid email or password"}), 401
                )
                return response

    if session.get("logged_in"):
        response = make_response(redirect(url_for("incident_management")), 200)
        return response

    response = make_response(render_template("login.html"), 200)
    return response


@app.route("/logout")
def logout():
    if session.get("logged_in"):
        session.clear()

    response = make_response(redirect(url_for("login")), 200)
    return response


@app.route("/api/v1/incident-management")
def incident_management_api():
    if session.get("logged_in"):
        if request.args.get("year") is not None:
            try:
                circles = []
                mean_time_to_repair = {}
                year = request.args.get("year")
                cursor.execute(
                    "SELECT * FROM incident_records WHERE timestamp > %s AND timestamp < %s ORDER BY timestamp DESC;",
                    (
                        datetime.strptime(year, "%Y"),
                        datetime.strptime(str(int(year) + 1), "%Y"),
                    ),
                )
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
                        sum_of_repair_times / number_of_incidents
                    )

                response = make_response(
                    jsonify(
                        query_result, mean_time_to_repair, sort_month_wise(query_result)
                    ),
                    200,
                )
                return response

            except Exception as e:
                response = make_response(
                    jsonify({"error": "Invalid request", "error_message": str(e)}), 400
                )
                return response

        response = make_response(jsonify({"error": "Invalid request"}), 400)
        return response

    response = make_response(jsonify({"error": "Not authorized"}), 401)
    return response


@app.route("/api/v1/incident-management/<id>")
def incident_management_api_id(id):
    if session.get("logged_in"):

        if not id.isdigit():

            response = make_response(jsonify({"error": "Invalid incident id"}), 400)
            return response
        cursor.execute("SELECT * FROM incident_records WHERE incident_id = %s;", (id,))
        query_result = cursor.fetchone()

        if query_result is None:

            response = make_response(jsonify({"error": "Invalid incident id"}), 400)
            return response

        response = make_response(jsonify(query_result), 200)
        return response
    response = make_response(jsonify({"error": "Not authorized"}), 401)
    return response


@app.route("/api/v1/meter-reading")
def meter_reading_api():
    if session.get("logged_in"):

        if request.args.get("year") is not None:

            try:

                cursor.execute(
                    "SELECT * FROM meter_reading_record WHERE timestamp > %s AND timestamp < %s ORDER BY timestamp DESC;",
                    (
                        datetime.strptime(request.args.get("year"), "%Y"),
                        datetime.strptime(str(int(request.args.get("year")) + 1), "%Y"),
                    ),
                )
                query_result = cursor.fetchall()

                monthly_bill_distribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                for result in query_result:
                    monthly_bill_distribution[result[2].month - 1] += result[1]

                circle_bill_distribution = {
                    "GUJ": 0,
                    "CHN": 0,
                    "DEL": 0,
                    "KOL": 0,
                    "MUM": 0,
                    "PUN": 0,
                }
                for result in query_result:
                    circle_bill_distribution[result[3]] += result[1]

                monthwise_circle_distribution = {}

                for result in query_result:
                    if result[3] not in monthwise_circle_distribution:
                        monthwise_circle_distribution[result[3]] = [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                        ]
                    monthwise_circle_distribution[result[3]][
                        result[2].month - 1
                    ] += result[1]

                for circle in monthwise_circle_distribution:
                    monthwise_circle_distribution[circle] = list(
                        filter(lambda a: a != 0, monthwise_circle_distribution[circle])
                    )

                if (
                    request.args.get("year") == str(datetime.now().year)
                    and monthly_bill_distribution[-1] == 0
                ):
                    predicted_monthly_bill_distribution = copy.deepcopy(
                        monthly_bill_distribution
                    )

                    prediction_result = prediction()
                    predicted_monthly_bill_distribution[
                        prediction_result[0] - 1
                    ] = prediction_result[1]

                    monthly_bill_distribution = list(
                        filter(lambda a: a != 0, monthly_bill_distribution)
                    )

                    predicted_monthly_bill_distribution = list(
                        filter(lambda a: a != 0, predicted_monthly_bill_distribution)
                    )

                    response = make_response(
                        jsonify(
                            monthly_bill_distribution,
                            predicted_monthly_bill_distribution,
                            circle_bill_distribution,
                            monthwise_circle_distribution
                            
                        ),
                        200,
                    )
                    return response

                monthly_bill_distribution = list(
                    filter(lambda a: a != 0, monthly_bill_distribution)
                )

                response = make_response(
                    jsonify(
                        monthly_bill_distribution,
                        circle_bill_distribution,
                        monthwise_circle_distribution,
                    ),
                    200,
                )
                return response

            except Exception as e:
                print(e)
                response = make_response(
                    jsonify({"error": "Invalid request", "error_message": str(e)}), 400
                )
                return response

        response = make_response(jsonify({"error": "Invalid request"}), 400)
        return response

    response = make_response(jsonify({"error": "Not authorized"}), 401)
    return response


@app.route("/api/v1/user/profile")
def user_profile_api():
    if session.get("logged_in"):
        query_result = {
            "user_name": session["username"],
            "profile_picture_url": session["profile_picture_url"],
        }
        response = make_response(jsonify(query_result), 200)
        return response

    response = make_response(jsonify({"error": "Not authorized"}), 401)
    return response


@app.route("/api/v1/export")
def export_api():
    if session.get("logged_in"):
        if request.args.get("year") is not None and request.args.get("uri") is not None:
            try:
                year = request.args.get("year")
                uri = request.args.get("uri")
                if uri == "incident-management":
                    cursor.execute(
                        "SELECT * FROM incident_records WHERE timestamp > %s AND timestamp < %s ORDER BY timestamp DESC;",
                        (
                            datetime.strptime(year, "%Y"),
                            datetime.strptime(str(int(year) + 1), "%Y"),
                        ),
                    )
                    query_result = cursor.fetchall()
                    with open("Incident Management_Report_" + year + ".csv", "w") as f:
                        f.write(
                            "Incident ID,Employee Name,Circle Name,Site ID,Site Name,TimeStamp,Approved,Verified,Incident Description,Incident Type,Incident Cause,Incident Action,Repair Time (Hours)\n"
                        )
                        for result in query_result:
                            data = (
                                str(result[0])
                                + ","
                                + str(result[1])
                                + ","
                                + str(result[2])
                                + ","
                                + str(result[3])
                                + ","
                                + str(result[4])
                                + ","
                                + datetime.strftime(result[5], "%d/%m/%Y %H:%M:%S")
                                + ","
                                + str(result[6])
                                + ","
                                + str(result[7])
                                + ","
                                + str(result[8])
                                + ","
                                + str(result[9])
                                + ","
                                + str(result[10])
                                + ","
                                + str(result[11])
                                + ","
                                + str(result[13])
                                + "\n"
                            )
                            f.write(data)

                    response = make_response(
                        send_from_directory(
                            ".",
                            "Incident Management_Report_" + year + ".csv",
                            as_attachment=True,
                        ),
                        200,
                    )
                    return response

                elif uri == "meter-reading":
                    cursor.execute(
                        "SELECT * FROM meter_reading_record WHERE timestamp > %s AND timestamp < %s ORDER BY timestamp DESC;",
                        (
                            datetime.strptime(year, "%Y"),
                            datetime.strptime(str(int(year) + 1), "%Y"),
                        ),
                    )
                    query_result = cursor.fetchall()
                    with open("Meter Reading_Report_" + year + ".csv", "w") as f:
                        f.write("ID,Bill Amount,TimeStamp,Circle Name\n")
                        for result in query_result:
                            data = (
                                str(result[0])
                                + ","
                                + str(result[1])
                                + ","
                                + datetime.strftime(result[2], "%d/%m/%Y %H:%M:%S")
                                + ","
                                + str(result[3])
                                + "\n"
                            )
                            f.write(data)

                        response = make_response(
                            send_from_directory(
                                ".",
                                "Meter Reading_Report_" + year + ".csv",
                                as_attachment=True,
                            ),
                            200,
                        )
                        return response

            except Exception as e:
                response = make_response(
                    jsonify({"error": "Invalid request", "error_message": str(e)}), 400
                )
                return response

        response = make_response(jsonify({"error": "Invalid request"}), 400)
        return response
    response = make_response(jsonify({"error": "Not authorized"}), 401)
    return response


@app.errorhandler(404)
def page_not_found(e):
    response = make_response(render_template("under_construction.html"), 404)
    return response


if __name__ == "__main__":
    app.run(debug=True)

