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

// Get all movies with or without reviews
export const getMovies = async (includeReviews = true) => {
  try {
    const response = await authAxios.get(`${API_URL}/movies${includeReviews ? '?reviews=true' : ''}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get movie by ID
export const getMovieById = async (id, includeReviews = true) => {
  try {
    const response = await authAxios.get(`${API_URL}/movies/${id}${includeReviews ? '?reviews=true' : ''}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Search movies
export const searchMovies = async (searchTerm) => {
  try {
    const response = await authAxios.post(`${API_URL}/movies/search`, { searchTerm });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Add a new movie
export const addMovie = async (movieData) => {
  try {
    const response = await authAxios.post(`${API_URL}/movies`, movieData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
}; 