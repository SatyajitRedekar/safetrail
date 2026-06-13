# 🛡️ SafeTrail - Smart Tourist Safety Monitoring & Incident Response System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-safetrail--six.vercel.app-blue)](https://safetrail-six.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-green)](https://safetrail-api-1pq5.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-SatyajitRedekar-black)](https://github.com/SatyajitRedekar/safetrail)

> **SafeTrail** is an AI-powered tourist safety monitoring and real-time tracking system. It combines GPS telemetry, machine learning anomaly detection, geo-fencing, and blockchain-based digital ID generation to safeguard tourists and enable rapid incident response.
> 
> **Problem Statement ID:** 25002 | **Ministry:** Ministry of Development of North Eastern Region

---

## 🌐 Live URLs
| Service | URL |
|---------|-----|
| 🌐 **Frontend** | https://safetrail-six.vercel.app |
| 🔧 **Backend API** | https://safetrail-api-1pq5.onrender.com |
| 📁 **GitHub Repository** | https://github.com/SatyajitRedekar/safetrail |

---

## ✨ Features
- 🪪 **Blockchain-style Digital ID**: Generation of cryptographically hashed digital IDs for tourist profiles.
- 🚨 **One-Click SOS Panic Alert**: Instantly triggers emergency alerts with real-time GPS tracking coordinates.
- 🚔 **Police Command Center**: Web-based administration dashboard monitoring active tourists and geofences.
- 🧠 **AI Anomaly Detection**: Real-time detection of speed spikes, prolonged inactivity, and route deviation.
- 🗺️ **Geo-Fencing Protection**: Interactive warning zones for high-risk regions in Northeast India.
- 🌐 **Multilingual Support**: Supports English, Hindi, Bengali, Assamese, and Marathi.
- 🔔 **Real-Time Push Alerts**: Web socket notifications via Socket.io.

---

## 🛠️ Tech Stack
- **Frontend:** React.js / OpenStreetMap
- **Backend:** Node.js / Express.js
- **AI Service:** Python / Flask / Scikit-learn
- **Database:** MongoDB Atlas
- **Real-Time Communications:** Socket.io

---

## 📁 Repository Structure
```
safetrail/
├── client/                 # React Frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.js        # Landing page
│       │   ├── Register.js    # Tourist registration & Profile access
│       │   ├── Panic.js       # SOS Emergency button
│       │   └── Visit.js       # Safety destinations page
│       └── App.js
├── server/                 # Node.js Backend API
│   ├── controllers/        # Route controllers (auth, alerts)
│   ├── models/             # Mongoose schemas (Tourist, Alert)
│   ├── routes/             # API Endpoint routes
│   └── index.js            # Main server file
├── ai-service/             # Python AI Microservice
│   ├── app.py              # Flask API server
│   ├── model.py            # Anomaly detector class
│   ├── train.py            # Training script (88% accuracy)
│   ├── evaluate.py         # Validation evaluation script
│   └── requirements.txt    # Python requirements
├── docs/                   # System documentation
│   └── architecture.md     # Architecture documentation
├── .env.example            # Environment variables example template
└── README.md
```

---

## 📦 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js (LTS version)](https://nodejs.org)
- [Python (3.8+)](https://python.org)
- [Git](https://git-scm.com)

---

### 2. Node.js Backend Server
Navigate to `/server` directory, install packages, configure environment, and run:
```bash
cd server
npm install
```
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://satyajit:safetrail123@cluster0.seztmft.mongodb.net/safetrail?appName=Cluster0
JWT_SECRET=safetrail_secret_key
```
Start the backend:
```bash
node index.js
```

---

### 3. Node.js Frontend Client
Open a new terminal window, navigate to `/client`, install dependencies, and run:
```bash
cd client
npm install --legacy-peer-deps
npm start
```
The browser will automatically load the frontend at `http://localhost:3000`.

---

### 4. Python AI Service
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

## 🔑 Shared Databases & APIs

### MongoDB Atlas Access
```
Username: satyajit
Password: safetrail123
Cluster: cluster0.seztmft.mongodb.net
Database: safetrail
```

### Server API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/tourists/register` | Register a tourist (generates Digital ID) |
| **POST** | `/api/tourists/login` | Login tourist & retrieve digital ID profile |
| **GET** | `/api/tourists/all` | Get all registered tourists |
| **POST** | `/api/alerts/panic` | Trigger real-time panic alert |
| **GET** | `/api/alerts/all` | Fetch all alerts |

---

## 👨‍💻 Team & License
- **Lead Developer:** Satyajit Redekar
  - GitHub: [@SatyajitRedekar](https://github.com/SatyajitRedekar)
  - LinkedIn: [satyajit-redekar](https://linkedin.com/in/satyajit-redekar)
- **License:** Project developed for the **Smart India Hackathon 2025** under the *Ministry of Development of North Eastern Region*.
