import joblib

# Load the trained model from disk
loaded_model = joblib.load('trained_model.joblib')

# Prepare the input features for prediction
next_month = 1  # Example: Next month's month (e.g., August)
next_year = 2030  # Example: Next month's year
input_features = [[next_month, next_year]]  # Example: List of input features

# Use the loaded model to make predictions
predictions = loaded_model.predict(input_features)

# Print the predictions
print(predictions)
