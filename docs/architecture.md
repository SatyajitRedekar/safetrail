# SafeTrail System Architecture

This document describes the high-level system architecture and data flow of the SafeTrail application, an AI-powered smart safety and tracking system for tourists.

---

## 🏗️ High-Level System Overview

SafeTrail is built on a decoupled, microservices-oriented architecture consisting of three primary layers:
1. **Frontend (React.js)**: A responsive single-page web application that serves both tourists (for registration, profile view, checking safety info, and triggering SOS alerts) and administrators/command centers (for real-time monitoring and alert handling).
2. **Main Backend (Node.js & Express.js)**: Acts as the primary API gateway, orchestrates user authentication, manages tourist database records, handles web sockets connection for real-time alerts, and proxies complex computational requests to the AI service.
3. **AI Anomaly Detection Service (Python & Flask)**: A machine learning microservice that runs an **Isolation Forest** model to analyze tourist telemetry data (speed, stationary time, and route deviation) and flag potential safety anomalies.

```
                  ┌──────────────────────┐
                  │   React Web Client   │
                  │   (Tourist & Admin)  │
                  └──────────┬───────────┘
                             │
                      HTTP / │ Real-Time
                      JSON   │ WebSockets
                             ▼
                  ┌──────────────────────┐
                  │ Node.js API Gateway  │◀───▶ [ MongoDB Atlas ]
                  │    & Event Server    │
                  └──────────┬───────────┘
                             │
                      HTTP / │ Telemetry Payload
                      JSON   ▼
                  ┌──────────────────────┐
                  │  Python AI Service   │
                  │ (Flask + Scikit-Learn)
                  └──────────────────────┘
```

---

## 🔌 Component Details

### 1. React Web Client (`/client`)
- **Key Modules**:
  - **AuthContext**: React context managing user sessions and login state.
  - **Dashboard**: Real-time admin/police control panel featuring active alerts, live maps, and telemetry statuses.
  - **Register / Login**: Unified authentication system for tourists.
  - **Panic**: One-click emergency SOS dispatch showing live geolocation.
  - **Visit**: High-risk zone warnings and tourist-centric safety resources.

### 2. Node.js Express Server (`/server`)
- **Database Engine**: MongoDB Atlas (mongoose ODM).
- **Security**: JWT-based session tokens and bcryptjs password encryption.
- **Real-Time Layer**: Socket.io for immediate notification propagation from tourists in distress directly to admin consoles.
- **Endpoints**:
  - `/api/tourists`: Register and authenticate tourists.
  - `/api/alerts`: Trigger, fetch, and resolve distress alerts.

### 3. AI Service (`/ai-service`)
- **Engine**: Flask & Scikit-learn (Isolation Forest).
- **Core Models**: Multi-dimensional telemetry model tracking:
  - **Speed**: Movement speeds outside normal walking/trekking thresholds.
  - **Time Stationary**: Protracted inactivity which could indicate injury.
  - **Distance from Route**: Deviation metrics from defined paths or safe zones.
- **Scripts**:
  - `train.py`: Generates the predictive model binary (`safetrail_model.pkl`).
  - `evaluate.py`: Tests the model's accuracy, precision, recall, and F1-score against validation datasets.

---

## 🔄 Core Data Flow Sequence

### A. Tourist Telemetry & Anomaly Analysis
1. The **React Client** periodically pushes tourist coordinates, speed, and status update.
2. The **Node.js Server** validates the request and forwards the metrics to the **Python AI Service**.
3. The **AI Service** feeds telemetry features into the trained `IsolationForest` model.
4. If an anomaly is identified (`anomaly_score` falls below negative threshold), a high-risk level is flagged.
5. The evaluation results are returned to the Node.js backend.

### B. SOS Alert Sequence
1. A tourist clicks the **SOS button** on the client.
2. The client fetches GPS coordinates and immediately fires a POST request to `/api/alerts/panic`.
3. The Node.js server updates the database and broadcasts a WebSocket notification (`Socket.io`) to all connected admin and command center dashboards.
4. Dashboards emit a warning sound and flash the user's location on the interactive map.
