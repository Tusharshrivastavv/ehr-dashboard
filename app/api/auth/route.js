import { NextResponse } from 'next/server';
import { encode } from 'base-64';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Use the client credentials from environment variables
    const clientId = process.env.DRCHRONO_CLIENT_ID;
    const clientSecret = process.env.DRCHRONO_CLIENT_SECRET;
    
    // Create basic auth header
    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = encode(credentials);
    
    // Make request to DrChrono token endpoint using resource owner password credentials grant
    const response = await fetch('https://drchrono.com/o/token/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || 'Authentication failed' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });
    
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}