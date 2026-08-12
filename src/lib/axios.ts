import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = 'https://droid4-backend.vercel.app'
// const baseURL = 'https://droid4-backend-0b3a.onrender.com'
// const baseURL = 'http://localhost:4000'

const api = axios.create({
  baseURL, // your NestJS backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the auth token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('[axios] No token found in cookies for request:', config.url);
  }
  return config;
});

// Log 401s to help diagnose auth issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn('[axios] 401 Unauthorized on:', error.config?.url, '| Token present:', !!Cookies.get('token'));
    }
    return Promise.reject(error);
  }
);

export default api;
