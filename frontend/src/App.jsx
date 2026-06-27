import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';

// Secure Private Route Wrapper
const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navigation Bar Header */}
        <nav className="bg-emerald-600 text-white shadow-md px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="font-bold text-xl tracking-tight">GamePartner</Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            {localStorage.getItem('token') ? (
              <>
                <Link to="/dashboard" className="hover:text-emerald-200">Find Matches</Link>
                <Link to="/create-request" className="hover:text-emerald-200">Create Invite</Link>
                <button onClick={handleLogout} className="bg-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-800 cursor-pointer">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="bg-white text-emerald-600 px-4 py-1.5 rounded font-semibold hover:bg-emerald-50">Register</Link>
              </>
            )}
          </div>
        </nav>

        {/* Dynamic Route Pages */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create-request" element={<PrivateRoute><CreateRequest /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;