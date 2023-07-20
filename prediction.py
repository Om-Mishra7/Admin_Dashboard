import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from training_csv_generator import csv_generator
import datetime

def prediction():
    # Generate the CSV file
    csv_generator()

    # Read the CSV data
    data = pd.read_csv('bill.csv', parse_dates=['timestamp'], index_col='timestamp')

    # Visualize the data
    data.plot(figsize=(10, 6))
    plt.xlabel('Timestamp')
    plt.ylabel('Electricity Bill')
    plt.title('Electricity Bill over Time')
    plt.show()

    # Check the Autocorrelation and Partial Autocorrelation plots to identify model parameters
    plot_acf(data['electricity_bill'], lags=12)
    plt.title('Autocorrelation Plot')
    plt.show()

    plot_pacf(data['electricity_bill'], lags=12)
    plt.title('Partial Autocorrelation Plot')
    plt.show()

    # Fit the SARIMA model
    order = (1, 1, 1)           # (p, d, q)
    seasonal_order = (1, 1, 1, 12)  # (P, D, Q, s)
    model = SARIMAX(data['electricity_bill'], order=order, seasonal_order=seasonal_order)
    results = model.fit()

    last_timestamp = data.index[-1]

    # Predict the next result
    next_timestamp = last_timestamp + pd.DateOffset(months=1)
    next_prediction = results.get_prediction(start=next_timestamp, dynamic=False)
    next_mean = next_prediction.predicted_mean[0]

    return (next_timestamp.month, int(next_mean))


if __name__ == '__main__':
    prediction()