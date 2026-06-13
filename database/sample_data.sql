-- Sample Data for Testing
USE safetrail_db;

INSERT INTO tourists VALUES 
(1,'ST-10001','Satyajit Redekar','satyajit@gmail.com',
'9876543210','MH1234','9876543211','Northeast India',
'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
'2024-01-15 10:00:00'),
(2,'ST-10002','Rahul Sharma','rahul@gmail.com',
'9123456780','DL5678','9123456781','Kashmir',
'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
'2024-01-16 11:00:00');

INSERT INTO location_history 
(digital_id, latitude, longitude, speed) VALUES
('ST-10001', 27.1751, 78.0421, 15.5),
('ST-10001', 27.1752, 78.0422, 14.2),
('ST-10002', 34.0837, 74.7973, 0.0);

INSERT INTO emergency_alerts 
(digital_id, latitude, longitude, status, risk_level, reason) VALUES
('ST-10002', 34.0837, 74.7973, 'DISPATCHED', 
'HIGH', 'Prolonged inactivity detected');
