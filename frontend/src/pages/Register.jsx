import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    skillLevel: 'Beginner',
    availability: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Save the token to local storage so the application keeps us logged in
      localStorage.setItem('token', res.data.token);
      
      // Direct user straight onto the match feed board
      navigate('/dashboard');
      window.location.reload(); // Refresh header navigation state
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
          <input 
            type="text" 
            required 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
          <input 
            type="email" 
            required 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input 
            type="password" 
            required 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Your Locality / Clubhouse Block</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Block C, Royal Crest Society" 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Skill Level</label>
          <select 
            className="w-full border rounded-lg p-2 bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500" 
            value={formData.skillLevel} 
            onChange={e => setFormData({...formData, skillLevel: e.target.value})}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">General Play Availability</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Weekends 5 PM onwards" 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
            value={formData.availability}
            onChange={e => setFormData({...formData, availability: e.target.value})} 
          />
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition cursor-pointer mt-2">
          Complete Registration
        </button>
      </form>
      <p className="text-sm text-center text-gray-500 mt-4">
        Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}