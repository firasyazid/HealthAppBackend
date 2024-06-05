from flask import Flask, request, jsonify
import joblib
import pandas as pd
app = Flask(__name__)

# Load the model
model = joblib.load("C:/Users/firas/OneDrive/Desktop/models/svc_model.joblib")
def predict_result(symptoms):
    input_data = pd.DataFrame(symptoms)
    # Make a prediction
    prediction = model.predict(input_data)
    return prediction

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    # Extract symptoms from the request data
    symptoms = {
        'Breathing Problem': 1 if data.get('Breathing Problem') else 0,
        'Fever': 1 if data.get('Fever') else 0,
        'Dry Cough': 1 if data.get('Dry Cough') else 0,
        'Sore throat': 1 if data.get('Sore throat') else 0,
        'Running Nose': 1 if data.get('Running Nose') else 0,
        'Asthma': 1 if data.get('Asthma') else 0,
        'Chronic Lung Disease': 1 if data.get('Chronic Lung Disease') else 0,
        'Headache': 1 if data.get('Headache') else 0,
        'Heart Disease': 1 if data.get('Heart Disease') else 0,
        'Diabetes': 1 if data.get('Diabetes') else 0,
        'Hyper Tension': 1 if data.get('Hyper Tension') else 0,
        'Fatigue': 1 if data.get('Fatigue') else 0,
        'Gastrointestinal': 1 if data.get('Gastrointestinal') else 0,
        'Abroad travel': 1 if data.get('Abroad travel') else 0,
        'Contact with COVID Patient': 1 if data.get('Contact with COVID Patient') else 0,
        'Visited Public Exposed Places': 1 if data.get('Visited Public Exposed Places') else 0
    }

    # Convert symptoms to a DataFrame with a single row and appropriate column names
    input_data = pd.DataFrame([symptoms])

    # Ensure the DataFrame columns match the model's expected features
    model_features = model.feature_names_in_
    input_data = input_data.reindex(columns=model_features, fill_value=0)

    prediction = predict_result(input_data)
    result = 'Positive' if prediction[0] == 1 else 'Negative'
    
    return jsonify({'prediction': result})
if __name__ == '__main__':
    app.run(host='192.168.1.18', port=5000, debug=True)
