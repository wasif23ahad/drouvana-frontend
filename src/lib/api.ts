import axios from 'axios';

/**
 * Global API client for Drouvana
 * Follows Rule 114: All API calls must use a custom instance
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error reporting
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error(`[API Error] ${message}`, error);
    return Promise.reject(error);
  }
);

export default api;
