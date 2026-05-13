import axios from 'axios';
import { getSession } from 'next-auth/react';

const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    const configured = process.env.NEXT_PUBLIC_API_URL || '';
    if (!configured || configured.includes('localhost')) {
      return 'https://douvana-backend.vercel.app';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

/**
 * Global API client for Drouvana
 * Follows Rule 114: All API calls must use a custom instance
 */
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


// Request interceptor to dynamically inject backend JWT Bearer tokens
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    try {
      const session = await getSession();
      const token = (session?.user as any)?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Gracefully continue if session read fails
    }
  }
  return config;
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
