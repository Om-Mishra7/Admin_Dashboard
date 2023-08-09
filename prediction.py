import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import time
import mysql.connector
import os

connection = mysql.connector.connect(
    host="aws.connect.psdb.cloud",
    user=os.getenv("planetscale_username"),
    passwd=os.getenv("planetscale_password"),
    db=os.getenv("planetscale_db"),
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


def prediction():

    # Generate the CSV file
    if os.path.exists('bill.csv'):
        if time.time() - os.path.getmtime('bill.csv') > 86400:
            csv_generator()
    else:
        csv_generator()

    # Read the CSV data
    data = pd.read_csv('bill.csv',
                       parse_dates=['timestamp'],
                       index_col='timestamp')

    # Check the Autocorrelation and Partial Autocorrelation plots to identify model parameters
    plot_acf(data['electricity_bill'], lags=12)

    plot_pacf(data['electricity_bill'], lags=12)

    # Fit the SARIMA model
    order = (1, 1, 1)  # (p, d, q)
    seasonal_order = (1, 1, 1, 12)  # (P, D, Q, s)
    model = SARIMAX(data['electricity_bill'],
                    order=order,
                    seasonal_order=seasonal_order)
    results = model.fit()

    last_timestamp = data.index[-1]

    # Predict the next result
    next_timestamp = last_timestamp + pd.DateOffset(months=1)
    next_prediction = results.get_prediction(start=next_timestamp,
                                             dynamic=False)
    next_mean = next_prediction.predicted_mean[0]

    return (next_timestamp.month, int(next_mean))


if __name__ == '__main__':
    print(prediction())
