import axios from 'axios';

const api = axios.create({
  baseURL: 'https://droid4-backend.onrender.com', // your NestJS backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional if you're using cookies
});

export default api;
