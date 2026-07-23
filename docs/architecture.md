# SafeTravel System Architecture

This document describes the high-level system architecture and data flow of the SafeTravel application, an AI-powered smart safety and tracking system for tourists.

---

## 🏗️ High-Level System Overview

SafeTravel is built on a decoupled, microservices-oriented architecture consisting of three primary layers:
1. **Frontend (React.js)**: A responsive single-page web application that serves both tourists (for registration, profile view, checking safety info, and triggering SOS alerts) and administrators/command centers (for real-time monitoring and alert handling).
2. **Main Backend (Spring Boot & Spring Data JPA)**: Acts as the primary API gateway, orchestrates user authentication (Spring Security & JWT), manages tourist database records (MySQL via Hibernate/JPA), and handles WebSockets for real-time alerts.
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
                  │ Spring Boot Backend  │◀───▶ [ MySQL Database ]
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

### 2. Spring Boot Server (`/server`)
- **Database Engine**: MySQL (Spring Data JPA / Hibernate).
- **Security**: JWT-based session tokens and BCrypt password encryption (Spring Security).
- **Real-Time Layer**: Native WebSockets (`/ws/broadcast`) for immediate notification propagation from tourists in distress directly to admin consoles.
- **Endpoints**:
  - `/api/tourists`: Register and authenticate tourists, check anomalies, handle pings.
  - `/api/alerts`: Trigger, fetch, and resolve distress alerts.
  - `/api/zones`: Create and display high-risk boundaries.

### 3. AI Service (`/ai-service`)
- **Engine**: Flask & Scikit-learn (Isolation Forest).
- **Core Models**: Multi-dimensional telemetry model tracking:
  - **Speed**: Movement speeds outside normal walking/trekking thresholds.
  - **Time Stationary**: Protracted inactivity which could indicate injury.
  - **Distance from Route**: Deviation metrics from defined paths or safe zones.
- **Scripts**:
  - `train.py`: Generates the predictive model binary (`safetravel_model.pkl`).
  - `evaluate.py`: Tests the model's accuracy, precision, recall, and F1-score against validation datasets.

---

## 🔄 Core Data Flow Sequence

### A. Tourist Telemetry & Anomaly Analysis
1. The **React Client** periodically pushes tourist coordinates, speed, and status update.
2. The **Spring Boot Server** validates the request and forwards the metrics to the **Python AI Service**.
3. The **AI Service** feeds telemetry features into the trained `IsolationForest` model.
4. If an anomaly is identified (`anomaly_score` falls below negative threshold), a high-risk level is flagged.
5. The evaluation results are returned to the Spring Boot backend.

### B. SOS Alert Sequence
1. A tourist clicks the **SOS button** on the client.
2. The client fetches GPS coordinates and immediately fires a POST request to `/api/alerts/panic`.
3. The Spring Boot server updates the MySQL database and broadcasts a WebSocket notification (`/ws/broadcast`) to all connected admin and command center dashboards.
4. Dashboards emit a warning sound and flash the user's location on the interactive map.
