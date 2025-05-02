import axios from 'axios';
import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with auth header
const authAxios = axios.create();

// Add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a review
export const addReview = async (reviewData) => {
  try {
    const response = await authAxios.post(`${API_URL}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
}; 