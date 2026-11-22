
import axios from 'axios';

const configuredUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

const baseURL = configuredUrl
  ? (configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl}/api`)
  : 'https://partner-finder-api.onrender.com/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('pf_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
