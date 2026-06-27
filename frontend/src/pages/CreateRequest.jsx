import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    game: 'Chess',
    locationType: 'Society Clubhouse',
    specificLocation: '',
    timeSlot: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create invite');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#212529', marginBottom: '25px' }}>Find a Playing Partner</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>Select Game</label>
          <select name="game" value={formData.game} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px' }}>
            <option value="Chess">Chess</option>
            <option value="Badminton">Badminton</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>Venue Type</label>
          <select name="locationType" value={formData.locationType} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px' }}>
            <option value="Home">Home</option>
            <option value="Society Clubhouse">Society Clubhouse</option>
            <option value="Local Ground">Local Ground</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>Specific Location Details</label>
          <input 
            type="text" 
            name="specificLocation" 
            value={formData.specificLocation} 
            onChange={handleChange} 
            placeholder="e.g., Court No. 2, Near main gate"
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>Preferred Date & Time</label>
          <input 
            type="datetime-local" 
            name="timeSlot" 
            value={formData.timeSlot} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0ca678', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(12, 166, 120, 0.2)', transition: 'background 0.2s' }}>
          Publish Open Invite
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;