from datetime import datetime, timedelta

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Load the electricity bill data from the CSV file
df = pd.read_csv('bill.csv')

# Convert timestamp column to datetime objects
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Extract the month and year from the timestamp column
df['month'] = df['timestamp'].dt.month
df['year'] = df['timestamp'].dt.year

# Extract the features (month and year) and the target variable (electricity bill)
X = df[['month', 'year']].values
y = df['electricity_bill'].values

# Create an initial model
model = LinearRegression()

# Define the number of iterations
num_iterations = 50000

# Train the model for the specified number of iterations
for i in range(num_iterations):
    # Train the model
    model.fit(X, y)

    # Get the last timestamp in the CSV file
    last_timestamp = df['timestamp'].iloc[-1]

    # Calculate the next month's timestamp
    next_month_timestamp = last_timestamp + timedelta(days=30)

    # Extract the month and year from the next month's timestamp
    next_month = next_month_timestamp.month
    next_year = next_month_timestamp.year

    # Predict the electricity bill for the next month
    prediction = model.predict([[next_month, next_year]])

    # Get the actual electricity bill for the next month
    actual_bill = 113.45  # Replace this with the actual value for the next month

    print(f"Predicted bill for {next_month},{next_year}: {prediction[0]}")
    print(f"Actual bill: {actual_bill}")
    print(f"Iteration Number : {i}")

    # Update the features (X) and target variable (y)
    X = np.append(X, [[next_month, next_year]], axis=0)
    y = np.append(y, actual_bill)

    # Check if there is a difference between the predicted and actual bill
    if actual_bill is not None and abs(prediction[0] - actual_bill) > 3:
        # Update the model with the new data
        model.fit(X, y)

# Save the trained model to disk
joblib.dump(model, 'trained_model.joblib')

loaded_model = joblib.load('trained_model.joblib')
