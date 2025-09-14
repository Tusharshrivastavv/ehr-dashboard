import { refreshAuthToken } from './auth';

let accessToken = null;
let refreshToken = null;

export const setTokens = (newAccessToken, newRefreshToken) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
};

export const apiRequest = async (endpoint, options = {}) => {
  if (!accessToken) {
    throw new Error('No access token available');
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

      const newTokens = await refreshAuthToken(refreshToken);
      accessToken = newTokens.access_token;
      refreshToken = newTokens.refresh_token;
      
      config.headers.Authorization = `Bearer ${accessToken}`;
      const retryResponse = await fetch(`https://drchrono.com/api/${endpoint}`, config);
      return await retryResponse.json();
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const patientsApi = {
  list: (params = {}) => apiRequest('patients', { params }),
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

export const appointmentsApi = {
  list: (params = {}) => apiRequest('appointments', { params }),
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

export const clinicalApi = {
  getPatientSummary: (patientId) => apiRequest(`patients/${patientId}/summary`),
};