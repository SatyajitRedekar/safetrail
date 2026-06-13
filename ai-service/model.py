import numpy as np
from sklearn.ensemble import IsolationForest
import pandas as pd

class SafeTrailAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self._train()
    
    def _train(self):
        training_data = pd.DataFrame({
            'speed': [5,15,30,40,10,20,25,8,12,35],
            'time_stationary': [2,1,0,0,5,3,0,4,2,1],
            'distance_from_route': [0.1,0.2,0.0,0.1,0.3,0.2,0.05,0.15,0.1,0.0]
        })
        self.model.fit(training_data)
    
    def predict(self, speed, time_stationary, distance_from_route):
        features = np.array([[speed, time_stationary, distance_from_route]])
        result = self.model.predict(features)
        return result[0] == -1
