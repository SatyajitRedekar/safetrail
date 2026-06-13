-- Useful Queries for SafeTrail System

-- Get all active tourists
SELECT * FROM tourists ORDER BY created_at DESC;

-- Get location history for a tourist
SELECT * FROM location_history 
WHERE digital_id = 'ST-10001' 
ORDER BY timestamp DESC;

-- Get all HIGH risk alerts
SELECT e.*, t.name, t.emergency_contact 
FROM emergency_alerts e
JOIN tourists t ON e.digital_id = t.digital_id
WHERE e.risk_level = 'HIGH'
ORDER BY e.triggered_at DESC;

-- Safety Score Calculation
SELECT 
    digital_id,
    COUNT(*) as total_routes,
    AVG(safety_score) as avg_safety_score
FROM route_history
GROUP BY digital_id;
