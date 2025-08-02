import axios from 'axios';

const baseURL = 'https://droid4-backend-0b3a.onrender.com'
// const baseURL = 'http://localhost:4000'

const api = axios.create({
  baseURL, // your NestJS backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },

});

export default api;
