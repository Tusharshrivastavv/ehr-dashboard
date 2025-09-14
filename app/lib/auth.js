import { encode } from 'base-64';

export const getAuthToken = async (code) => {
  const clientId = process.env.DRCHRONO_CLIENT_ID;
  const clientSecret = process.env.DRCHRONO_CLIENT_SECRET;
  const redirectUri = process.env.DRCHRONO_REDIRECT_URI;
  
  const credentials = `${clientId}:${clientSecret}`;
  const base64Credentials = encode(credentials);
  
  try {
    const response = await fetch('https://drchrono.com/o/token/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

export const refreshAuthToken = async (refreshToken) => {
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
      body: `refresh_token=${refreshToken}&grant_type=refresh_token`,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    throw error;
  }
};