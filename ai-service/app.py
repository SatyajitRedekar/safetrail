from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import IsolationForest
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)

db_config = {
    "host": "localhost",
    "user": "root", 
    "password": "your_password",
    "database": "safetravel_db"
}

# Train model on normal movement data
normal_data = np.array([
    [5, 2, 0.1], [15, 1, 0.2], [30, 0, 0.0],
    [40, 0, 0.1], [10, 5, 0.3], [20, 3, 0.2],
])
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(normal_data)

@app.route('/api/detect', methods=['POST'])
def detect_anomaly():
    data = request.json
    speed = float(data.get('speed', 0))
    time_stationary = float(data.get('time_stationary', 0))
    distance_from_route = float(data.get('distance_from_route', 0))
    features = np.array([[speed, time_stationary, distance_from_route]])
    prediction = model.predict(features)
    score = model.decision_function(features)[0]
    is_anomaly = prediction[0] == -1
    return jsonify({
        "is_anomaly": bool(is_anomaly),
        "risk_level": "HIGH" if score < -0.1 else "LOW",
        "anomaly_score": round(float(score), 4)
    })

@app.route('/api/tourists/register', methods=['POST'])
def register():
    return jsonify({"success": True, "message": "Registered"})

@app.route('/api/alerts/panic', methods=['POST'])
def panic():
    return jsonify({"success": True, "message": "Alert sent"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
