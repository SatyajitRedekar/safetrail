-- SafeTravel Database Schema
-- AI-Based Smart Safety and Tracking System

CREATE DATABASE IF NOT EXISTS safetravel_db;
USE safetravel_db;

-- Users Table
CREATE TABLE IF NOT EXISTS tourists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    passport VARCHAR(50) NOT NULL,
    emergency_contact VARCHAR(15) NOT NULL,
    risk_zone VARCHAR(100),
    blockchain_hash VARCHAR(64),
    ledger_status VARCHAR(20) DEFAULT 'VERIFIED',
    anomaly_status VARCHAR(20) DEFAULT 'NORMAL',
    last_ping DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Location History Table
CREATE TABLE IF NOT EXISTS location_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed FLOAT DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (digital_id) REFERENCES tourists(digital_id)
);

-- Emergency Alerts Table
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'DISPATCHED',
    risk_level VARCHAR(10) DEFAULT 'HIGH',
    reason VARCHAR(200),
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (digital_id) REFERENCES tourists(digital_id)
);

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(20) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(15) NOT NULL,
    relation VARCHAR(50),
    FOREIGN KEY (digital_id) REFERENCES tourists(digital_id)
);

-- Route History Table
CREATE TABLE IF NOT EXISTS route_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(20) NOT NULL,
    source_lat DECIMAL(10, 8),
    source_lng DECIMAL(11, 8),
    dest_lat DECIMAL(10, 8),
    dest_lng DECIMAL(11, 8),
    safety_score FLOAT DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (digital_id) REFERENCES tourists(digital_id)
);

-- System Logs Table
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(20),
    action VARCHAR(100),
    details TEXT,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    density DOUBLE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Zone Coordinates Table
CREATE TABLE IF NOT EXISTS zone_coordinates (
    zone_id INT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);
