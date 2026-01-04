// API base URL with fallback
export const getApiBaseUrl = () => {
  // Try environment variable first (ưu tiên cho Vercel và các môi trường khác)
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL from environment:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback URLs for different environments
  const fallbackUrls = {
    development: 'http://localhost:5000/api',  // Local development
    production: 'https://tienganh-k1k0.onrender.com/api'  // Production backend on Render
  };
  
  // Use localhost in development, production URL in production
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - Using API URL:', fallbackUrls.development);
    return fallbackUrls.development;
  }
  // Production mode (bao gồm Vercel)
  console.log('Production mode - Using API URL:', fallbackUrls.production);
  return fallbackUrls.production;
};

export const API_BASE_URL = getApiBaseUrl();
console.log('API_BASE_URL initialized:', API_BASE_URL);

