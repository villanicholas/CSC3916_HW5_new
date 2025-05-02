import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Login a user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(parseJwt(response.data.token)));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  const tokenExpiration = getTokenExpiration(token);
  if (tokenExpiration < new Date().getTime() / 1000) {
    logout();
    return false;
  }
  
  return true;
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Parse JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Get token expiration time
const getTokenExpiration = (token) => {
  const decodedToken = parseJwt(token);
  return decodedToken ? decodedToken.exp : 0;
}; 