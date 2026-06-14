// API Configuration for SPA
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_BASE_URL;
