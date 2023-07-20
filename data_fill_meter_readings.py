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

circle_names = ["GUJ", "CHN", "DEL", "KOL", "MUM", "PUN"]

def generate_timestamps_in_year(year):
    all_timestamps = []
    if year == 2023:
        for month in range(1, 8):
            date = datetime.datetime(year, month, random.randint(1, 28), random.randint(0, 23), random.randint(0, 59), random.randint(0, 59))
            date = date.strftime("%Y-%m-%d %H:%M:%S")
            all_timestamps.append(date)
        return all_timestamps
    for month in range(1, 13):
        date = datetime.datetime(year, month, random.randint(1, 28), random.randint(0, 23), random.randint(0, 59), random.randint(0, 59))
        date = date.strftime("%Y-%m-%d %H:%M:%S")
        all_timestamps.append(date)
    return all_timestamps

for circle_name in circle_names:
    for year in range(2012, 2024):
        timestamps = generate_timestamps_in_year(year)
        for timestamp in timestamps:
            try:
                cursor.execute("INSERT INTO meter_reading_record (circle_name, meter_reading, timestamp) VALUES (%s, %s, %s)", (circle_name, random.randint(60, 90), timestamp))
                print("Inserted", circle_name, year, timestamp)
            except:
                print(traceback.format_exc())
                continue