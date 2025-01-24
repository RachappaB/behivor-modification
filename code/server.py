from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load the trained model and label encoders
model = joblib.load("shock_prediction_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        input_data = request.json
        
        # Convert input data to DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Encode categorical data
        for column, le in label_encoders.items():
            if column in input_df:
                input_df[column] = le.transform(input_df[column])
        
        # Predict using the model
        prediction = model.predict(input_df)[0]
        
        # Convert the prediction to a human-readable format
        response = {
            "shock_needed": "Yes" if prediction == 1 else "No"
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
