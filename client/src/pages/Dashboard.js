import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('https://safetrail-api-1pq5.onrender.com/api/alerts');
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
    // In a full implementation, socket.io would listen here
  }, []);

  return (
    <div>
      <h1>Police Dashboard</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tourist ID</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a._id}>
              <td>{a.touristId?.name || a.touristId}</td>
              <td>{a.location?.lat}, {a.location?.lng}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
