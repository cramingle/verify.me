import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' // In production, this will be handled by Vercel rewrites
    : '/api', // In development, this will be proxied by Vite
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle error responses
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
    // Handle authentication errors (401)
    if (error.response?.status === 401) {
      // Clear token and redirect to login if authentication fails
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject({ message: errorMessage, status: error.response?.status });
  }
);

export default api; 