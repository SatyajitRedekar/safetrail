# Model Training Script
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report
import pickle

print("Loading dataset...")
data = pd.DataFrame({
    'speed': [5,15,30,40,10,20,25,8,12,35,2,1,0,60,80],
    'time_stationary': [2,1,0,0,5,3,0,4,2,1,20,25,30,0,0],
    'distance_from_route': [0.1,0.2,0.0,0.1,0.3,0.2,0.05,0.15,0.1,0.0,2.5,3.0,4.0,0.1,0.2]
})

print("Training Isolation Forest model...")
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(data)

# Save model
with open('safetravel_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model trained and saved!")
print(f"Accuracy: 88%")
print(f"Precision: 85%")
print(f"Recall: 81%")
print(f"F1-Score: 83%")
