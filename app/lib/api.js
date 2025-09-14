import { encode } from 'base-64';

let accessToken = null;
let refreshToken = null;

export const setTokens = (newAccessToken, newRefreshToken) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  
  // Also store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', newAccessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
  }
};

// Initialize tokens from localStorage on client side
if (typeof window !== 'undefined') {
  accessToken = localStorage.getItem('access_token');
  refreshToken = localStorage.getItem('refresh_token');
}

export const refreshAuthToken = async () => {
  const clientId = process.env.DRCHRONO_CLIENT_ID;
  const clientSecret = process.env.DRCHRONO_CLIENT_SECRET;
  
  const credentials = `${clientId}:${clientSecret}`;
  const base64Credentials = encode(credentials);
  
  try {
    const response = await fetch('https://drchrono.com/o/token/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setTokens(data.access_token, data.refresh_token);
      return data;
    } else {
      throw new Error(data.error_description || 'Token refresh failed');
    }
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    throw error;
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  if (!accessToken) {
    throw new Error('No access token available. Please connect to the API first.');
  }

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(`https://drchrono.com/api/${endpoint}`, config);
    
    if (response.status === 401 && refreshToken) {
      // Token expired, try to refresh
      const newTokens = await refreshAuthToken();
      accessToken = newTokens.access_token;
      refreshToken = newTokens.refresh_token;
      
      // Retry the request with the new token
      config.headers.Authorization = `Bearer ${accessToken}`;
      const retryResponse = await fetch(`https://drchrono.com/api/${endpoint}`, config);
      return await retryResponse.json();
    }
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Patient-related API calls
export const patientsApi = {
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`patients${queryString ? `?${queryString}` : ''}`);
  },
  get: (id) => apiRequest(`patients/${id}`),
  update: (id, data) => apiRequest(`patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  create: (data) => apiRequest('patients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Appointment-related API calls
export const appointmentsApi = {
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`appointments${queryString ? `?${queryString}` : ''}`);
  },
  get: (id) => apiRequest(`appointments/${id}`),
  update: (id, data) => apiRequest(`appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  create: (data) => apiRequest('appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Clinical data API calls
export const clinicalApi = {
  getPatientSummary: (patientId) => apiRequest(`patients/${patientId}/summary`),
  // Add more clinical endpoints as needed
};

export const logout = () => {
  accessToken = null;
  refreshToken = null;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Check if we have a valid token
export const isAuthenticated = () => {
  return !!accessToken;
};