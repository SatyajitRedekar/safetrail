import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', emergencyContact: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://safetrail-api-1pq5.onrender.com/api/tourists/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Registered successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Phone" onChange={e => setFormData({...formData, phone: e.target.value})} required />
        <input placeholder="Emergency Contact" onChange={e => setFormData({...formData, emergencyContact: e.target.value})} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
