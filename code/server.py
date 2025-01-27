from flask import Flask, request, jsonify
import pandas as pd
import joblib
import logging
from datetime import datetime

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load the trained model and label encoders
try:
    model = joblib.load("shock_prediction_model.pkl")
    label_encoders = joblib.load("label_encoders.pkl")
    logger.info("Model and label encoders loaded successfully.")
except Exception as e:
    logger.error("Failed to load model or label encoders: %s", str(e))
    raise e

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to ensure the server is running."""
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()}), 200

@app.route('/metadata', methods=['GET'])
def metadata():
    """Provide metadata about the model."""
    return jsonify({
        "model": "Shock Prediction Model",
        "features": list(label_encoders.keys()),
        "created_at": "2025-01-27",
        "description": "Predicts whether a shock is needed based on input features."
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to make predictions using the trained model."""
    try:
        # Get JSON data from the request
        input_data = request.json
        if not input_data:
            raise ValueError("No input data provided.")

        # Convert input data to DataFrame
        input_df = pd.DataFrame([input_data])
        logger.info("Received input data: %s", input_data)

        # Save input data to a CSV file
        input_df.to_csv('2.csv', mode='a', index=False, header=False)
        logger.info("Input data saved to 2.csv")

        # Validate required features
        missing_features = [col for col in label_encoders.keys() if col not in input_df]
        if missing_features:
            raise ValueError(f"Missing required features: {', '.join(missing_features)}")

        # Encode categorical data
        for column, le in label_encoders.items():
            if column in input_df:
                try:
                    input_df[column] = le.transform(input_df[column])
                except Exception as e:
                    raise ValueError(f"Error encoding column '{column}': {str(e)}")

        # Predict using the model
        prediction = model.predict(input_df)[0]

        # Convert the prediction to a human-readable format
        response = {
            "input": input_data,
            "prediction": "Yes" if prediction == 1 else "No",
            "timestamp": datetime.utcnow().isoformat()
        }

        logger.info("Prediction successful: %s", response)
        return jsonify(response), 200

    except Exception as e:
        logger.error("Prediction failed: %s", str(e))
        return jsonify({"error": str(e)}), 400







@app.route('/collect-data', methods=['POST'])
def collect_data():
    """Endpoint to collect data and make predictions using the model."""
    try:
        # Get JSON data from the request
        input_data = request.json
        if not input_data:
            # If input data is missing, fill with NULL (None in Python)
            input_data = {col: None for col in label_encoders.keys()}
            logger.warning("Input data was missing, filled with NULL values.")

        # Fill missing features with NULL (None)
        for feature in label_encoders.keys():
            if feature not in input_data:
                input_data[feature] = None
                logger.info(f"Feature '{feature}' was missing, filled with NULL.")

        # Convert input data to DataFrame
        input_df = pd.DataFrame([input_data])
        logger.info("Received input data: %s", input_data)

        # Save input data to a CSV file
        input_df.to_csv('3.csv', mode='a', index=False, header=False)
        logger.info("Input data saved to 3.csv")

        # Validate required features
        missing_features = [col for col in label_encoders.keys() if col not in input_df]
        if missing_features:
            raise ValueError(f"Missing required features: {', '.join(missing_features)}")

        # Encode categorical data
        for column, le in label_encoders.items():
            if column in input_df:
                try:
                    input_df[column] = le.transform(input_df[column])
                except Exception as e:
                    raise ValueError(f"Error encoding column '{column}': {str(e)}")

        # Predict using the model
        prediction = model.predict(input_df)[0]

        # Convert the prediction to a human-readable format
        response = {
            "input": input_data,
            "prediction": "Yes" if prediction == 1 else "No",
            "timestamp": datetime.utcnow().isoformat()
        }

        logger.info("Prediction successful: %s", response)
        return jsonify(response), 200

    except Exception as e:
        logger.error("Prediction failed: %s", str(e))
        return jsonify({"error": str(e)}), 400




if __name__ == '__main__':
    app.run(debug=True)
