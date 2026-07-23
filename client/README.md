# 🛡️ SafeTravel React Frontend

This directory contains the React.js client frontend application for the **SafeTravel** Smart Tourist Safety Monitoring System.

## Features
- **Tourist Registration & Profile Access**: Secure authentication via Spring Security and JWT.
- **One-Click SOS Panic Button**: Distress alerts with live coordinates using OpenStreetMap and Leaflet.
- **Emergency Broadcasts**: Real-time banners powered by native WebSockets connected to `/ws/broadcast`.
- **Destination Explorer**: Safety score assessments and high-risk geofence notifications.

## Getting Started

### 1. Installation
Install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Configuration
Check connection settings in `src/config.js` to ensure the frontend points to the Spring Boot backend port (`5000`):
```javascript
export const API_URL = 'http://localhost:5000';
```

### 3. Run Development Server
```bash
npm start
```
The client will automatically load in your browser at `http://localhost:3000`.