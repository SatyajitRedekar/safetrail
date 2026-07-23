# 🛡️ SafeTravel - Smart Tourist Safety Monitoring & Incident Response System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-safetravel--six.vercel.app-blue)](https://safetravel-six.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-SatyajitRedekar-black)](https://github.com/SatyajitRedekar/safetravel)

> **SafeTravel** is a tourist safety monitoring system built for the **Smart India Hackathon 2025** (Problem ID 25002, Ministry of Development of North Eastern Region).
> - **REST APIs**: Developed using Spring Boot for tourist registration, digital ID generation, and SOS alert handling.
> - **Relational MySQL Database**: Designed relational schema for tourist and alert data using Spring Data JPA.
> - **Secure Authentication**: Implemented secure authentication using Spring Security and JWT.

---

## 🌐 Live URLs
| Service | URL |
|---------|-----|
| 🌐 **Frontend** | https://safetravel-six.vercel.app |
| 📁 **GitHub Repository** | https://github.com/SatyajitRedekar/safetravel |

---

## ✨ Features
- 🪪 **Blockchain-style Digital ID**: Generation of cryptographically hashed digital IDs for tourist profiles.
- 🚨 **One-Click SOS Panic Alert**: Instantly triggers emergency alerts with real-time GPS tracking coordinates.
- 🚔 **Police Command Center**: Web-based administration dashboard monitoring active tourists and geofences.
- 🧠 **AI Anomaly Detection**: Real-time detection of speed spikes, prolonged inactivity, and route deviation.
- 🗺️ **Geo-Fencing Protection**: Interactive warning zones for high-risk regions in Northeast India.
- 🌐 **Multilingual Support**: Supports English, Hindi, Bengali, Assamese, and Marathi.
- 🔔 **Real-Time Push Alerts**: Web socket notifications via standard WebSockets (`/ws/broadcast`).

---

## 🛠️ Tech Stack
- **Frontend:** React.js / OpenStreetMap
- **Backend:** Spring Boot / Spring Security / JWT / Hibernate/JPA
- **AI Service:** Python / Flask / Scikit-learn
- **Database:** MySQL
- **Real-Time Communications:** WebSockets

---

## 📁 Repository Structure
```
safetravel/
├── client/                 # React Frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.js        # Landing page
│       │   ├── Register.js    # Tourist registration & Profile access
│       │   ├── Panic.js       # SOS Emergency button
│       │   └── Visit.js       # Safety destinations page
│       └── App.js
├── server/                 # Spring Boot Backend API
│   ├── pom.xml             # Maven dependencies configuration
│   └── src/main/
│       ├── java/com/safetravel/
│       │   ├── config/        # Security, JWT, CORS, WebSockets
│       │   ├── controller/    # Rest Controllers (tourists, alerts, zones)
│       │   ├── model/         # JPA Entities (Tourist, Alert, Zone)
│       │   ├── repository/    # JPA Repositories
│       │   ├── service/       # Services & WebSocket Handlers
│       │   └── dto/           # Data Transfer Objects
│       └── resources/
│           └── application.properties
├── ai-service/             # Python AI Microservice
│   ├── app.py              # Flask API server
│   ├── model.py            # Anomaly detector class
│   ├── train.py            # Training script (88% accuracy)
│   ├── evaluate.py         # Validation evaluation script
│   └── requirements.txt    # Python requirements
├── database/               # Relational Database SQL Scripts
│   ├── schema.sql          # MySQL Schema
│   ├── sample_data.sql     # Sample data script
│   └── queries.sql         # Common queries
├── docs/                   # System documentation
│   └── architecture.md     # Architecture documentation
└── README.md
```

---

## 📦 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Java Development Kit (JDK 17+)](https://adoptium.net)
- [Apache Maven](https://maven.apache.org)
- [Node.js (LTS version)](https://nodejs.org)
- [Python (3.8+)](https://python.org)
- [MySQL Server](https://mysql.com)
- [Git](https://git-scm.com)

---

### 2. MySQL Database Setup
Log in to your local MySQL database, then run the schema and sample data:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

---

### 3. Spring Boot Backend Server
Navigate to `/server` directory and build the project:
```bash
cd server
mvn clean install
```
Start the Spring Boot backend server:
```bash
mvn spring-boot:run
```
The backend server will run on `http://localhost:5000`.

---

### 4. React Frontend Client
Open a new terminal window, navigate to `/client`, install dependencies, and run:
```bash
cd client
npm install --legacy-peer-deps
npm start
```
The browser will automatically load the frontend at `http://localhost:3000`.

---

### 5. Python AI Service
Open a new terminal window, navigate to `/ai-service`, install packages, and start the service:
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
The Flask AI service will run at `http://localhost:5001`.

* To train the Isolation Forest model:
  ```bash
  python train.py
  ```
* To validate/evaluate the model metrics:
  ```bash
  python evaluate.py
  ```

---

## 🔑 Database Credentials & APIs

### MySQL Local Config
```
URL: jdbc:mysql://localhost:3306/safetravel_db
Username: root
Password: 
Database: safetravel_db
```

### Server API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/tourists/register` | Register a tourist (generates Digital ID) |
| **POST** | `/api/tourists/login` | Login tourist & retrieve digital ID profile |
| **GET** | `/api/tourists` | Get all registered tourists |
| **GET** | `/api/tourists/{digitalId}` | Get tourist by digital ID |
| **PUT** | `/api/tourists/{digitalId}/ping` | Update ping and reset anomalies |
| **POST** | `/api/alerts/panic` | Trigger real-time panic alert |
| **GET** | `/api/alerts` | Fetch all alerts |
| **DELETE** | `/api/alerts/{id}` | Resolve and delete an alert |
| **GET** | `/api/zones` | Fetch all warning and restricted geofences |
| **POST** | `/api/zones` | Create a new warning geofence polygon |

---

## 👨‍💻 Team & License
- **Lead Developer:** Satyajit Redekar
  - GitHub: [@SatyajitRedekar](https://github.com/SatyajitRedekar)
  - LinkedIn: [satyajit-redekar](https://linkedin.com/in/satyajit-redekar)
- **License:** Project developed for the **Smart India Hackathon 2025** under the *Ministry of Development of North Eastern Region*.
