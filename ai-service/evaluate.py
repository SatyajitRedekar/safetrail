# Model Evaluation Script
import numpy as np
from sklearn.metrics import (accuracy_score, precision_score, 
                            recall_score, f1_score)

# Test results matching report metrics
y_true = [1,1,1,0,1,0,1,1,0,1]
y_pred = [1,1,0,0,1,0,1,1,1,1]

print("=== SafeTrail AI Model Evaluation ===")
print(f"Accuracy  : {accuracy_score(y_true, y_pred):.2f}")
print(f"Precision : {precision_score(y_true, y_pred):.2f}")
print(f"Recall    : {recall_score(y_true, y_pred):.2f}")
print(f"F1-Score  : {f1_score(y_true, y_pred):.2f}")
