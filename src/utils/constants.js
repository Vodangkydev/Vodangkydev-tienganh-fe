// API base URL with fallback
export const getApiBaseUrl = () => {
  // Try environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback URLs for different environments
  const fallbackUrls = [
    'http://localhost:5000/api',  // Local development first
    'https://tienganh-k1k0.onrender.com/api'  // Production backend on Render
  ];
  
  // Use localhost in development, production URL in production
  if (process.env.NODE_ENV === 'development') {
    return fallbackUrls[0];
  }
  return fallbackUrls[1];
};

export const API_BASE_URL = getApiBaseUrl();

