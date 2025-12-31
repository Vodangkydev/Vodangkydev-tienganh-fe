import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { vocabularyService } from './apiService';
import { statsService } from './apiService';

// Authentication service
export const authService = {
  // Check if user is authenticated
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      return { isAuthenticated: false, user: null };
    }

    try {
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token with backend
      const response = await axios.get(`${API_BASE_URL}/profile`);
      return {
        isAuthenticated: true,
        user: response.data.user
      };
    } catch (err) {
      console.error('Token verification failed:', err);
      // Token invalid, clear storage
      authService.logout();
      return { isAuthenticated: false, user: null };
    }
  },

  // Login
  login: async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password
    });
    
    const { token, user: userData } = response.data;
    
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user: userData };
  },

  // Register
  register: async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      password
    });
    
    const { token, user: userData } = response.data;
    
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user: userData };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }
};

