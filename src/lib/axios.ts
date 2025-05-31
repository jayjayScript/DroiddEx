import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // your NestJS backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional if you're using cookies
});

export default api;
