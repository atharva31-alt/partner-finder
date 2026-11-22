import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from './api';

// onLogin receives { token, user } from our own API after Google's token is verified server-side.
export default function GoogleButton({ onLogin }) {
  const [error, setError] = useState('');

  const handleSuccess = async ({ credential }) => {
    try {
      const { data } = await api.post('/auth/google', { credential });
      onLogin(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Google sign-in failed.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError('Google sign-in was cancelled or blocked.')}
        theme="outline" size="large" width="300" text="continue_with"
      />
      {error && <p style={{ color: 'var(--bad)', fontSize: 13, margin: 0 }}>{error}</p>}
    </div>
  );
}
