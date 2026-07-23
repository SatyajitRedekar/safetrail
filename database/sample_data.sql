-- Sample Data for Testing
USE safetravel_db;

INSERT INTO tourists (id, digital_id, name, email, password, phone, passport, emergency_contact, risk_zone, blockchain_hash, ledger_status, anomaly_status, last_ping, latitude, longitude, created_at) VALUES 
(1,'ST-10001','Satyajit Redekar','satyajit@gmail.com',
'$2a$10$Eux/8Gub0hXy8cIuQc/jVeXnOq0p4e4/e7b0j7x7r2e3i6k5a4m2e','9876543210','MH1234','9876543211','Northeast India',
'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
'VERIFIED','NORMAL','2026-07-23 10:00:00',27.1752,78.0422,'2026-07-23 10:00:00'),
(2,'ST-10002','Rahul Sharma','rahul@gmail.com',
'$2a$10$Eux/8Gub0hXy8cIuQc/jVeXnOq0p4e4/e7b0j7x7r2e3i6k5a4m2e','9123456780','DL5678','9123456781','Kashmir',
'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
'VERIFIED','NORMAL','2026-07-23 11:00:00',34.0837,74.7973,'2026-07-23 11:00:00');

INSERT INTO location_history 
(digital_id, latitude, longitude, speed) VALUES
('ST-10001', 27.1751, 78.0421, 15.5),
('ST-10001', 27.1752, 78.0422, 14.2),
('ST-10002', 34.0837, 74.7973, 0.0);

INSERT INTO emergency_alerts 
(digital_id, latitude, longitude, status, risk_level, reason) VALUES
('ST-10002', 34.0837, 74.7973, 'DISPATCHED', 
'HIGH', 'Prolonged inactivity detected');
