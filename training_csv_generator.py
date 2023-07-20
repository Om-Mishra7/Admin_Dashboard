import mysql.connector
import random
import datetime
import json
import traceback

connection = mysql.connector.connect(
    host='aws.connect.psdb.cloud',
    user='hxajbpzbbegsei3k0dlc',
    passwd='pscale_pw_FWRWtnJU7FMLgFFgDXPOEz5i76i3NLxNQRWxtvnQsMF',
    db='trinity-crest_digitel',
    autocommit=True,
)

cursor = connection.cursor()

def csv_generator():
    cursor.execute("SELECT * FROM meter_reading_record;")
    results = cursor.fetchall()

    result_dict = {}
    for result in results:
        if result[2].strftime("%Y-%m-1") not in result_dict:
            result_dict[result[2].strftime("%Y-%m-1")] = result[1]
        else:
            result_dict[result[2].strftime("%Y-%m-1")] += result[1]

    with open('bill.csv', 'w') as f:
        f.write("timestamp,electricity_bill\n")
        for key in result_dict:
            f.write(key + "," + str(result_dict[key]) + "\n")

    return 1

csv_generator()