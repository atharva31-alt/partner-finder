import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Save the token to local storage so the application knows we are logged in
      localStorage.setItem('token', res.data.token);
      
      // Take the user to the dashboard
      navigate('/dashboard');
      window.location.reload(); // Refresh header navigation state
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
          <input 
            type="email" 
            required 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none transition" 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input 
            type="password" 
            required 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none transition" 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition cursor-pointer mt-2">
          Sign In
        </button>
      </form>
      <p className="text-sm text-center text-gray-500 mt-4">
        Don't have an account? <Link to="/register" className="text-emerald-600 hover:underline">Register here</Link>
      </p>
    </div>
  );
}