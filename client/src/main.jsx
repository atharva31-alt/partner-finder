import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './index.css';

// Click ripple on interactive controls
document.addEventListener('pointerdown', (e) => {
  const t = e.target.closest && e.target.closest('.btn,.chip,.rb,.sl,.tabs button,.gb,.bnav a');
  if (!t || t.disabled) return;
  const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, d = document.createElement('span');
  d.className = 'ripple';
  d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  t.appendChild(d);
  setTimeout(() => d.remove(), 650);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing'}>
    <App />
  </GoogleOAuthProvider>
);
