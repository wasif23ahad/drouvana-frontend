import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

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
  // Allow browser to automatically calculate multipart/form-data boundaries for file uploads
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }

  if (typeof window !== 'undefined') {
    try {
      // First check if we have a locally cached token to prevent async context initialization race conditions
      let token = localStorage.getItem('drouvana_cached_token');
      
      const session = await getSession();
      const sessionToken = (session?.user as any)?.accessToken || (session as any)?.accessToken;
      
      if (sessionToken) {
        token = sessionToken;
        localStorage.setItem('drouvana_cached_token', sessionToken);
      }

      // If the session itself signals the refresh token is dead, force sign-out
      if ((session as any)?.error === 'RefreshTokenExpired') {
        localStorage.removeItem('drouvana_cached_token');
        signOut({ callbackUrl: '/login?reason=session_expired', redirect: true }).catch(() => {});
      }

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
    // Flush potentially stale/expired local token caching if unauthorized
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('drouvana_cached_token');
      // Trigger NextAuth signout to reset authentication state cleanly
      signOut({ callbackUrl: '/login?switch=true', redirect: true }).catch(() => {});
    }

    // Standardize error reporting
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error(`[API Error] ${message}`, error);
    return Promise.reject(error);
  }
);

export default api;
