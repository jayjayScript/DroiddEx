import axios from 'axios';

// const baseURL = 'https://droid4-backend.onrender.com'
const baseURL = 'http://localhost:4000'

const api = axios.create({
  baseURL, // your NestJS backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional if you're using cookies
});

export default api;
