import { getAuthToken } from '@/lib/auth';
import { setTokens } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  try {
    const tokens = await getAuthToken(code);
    setTokens(tokens.access_token, tokens.refresh_token);
    
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('access_token', tokens.access_token, { httpOnly: true });
    response.cookies.set('refresh_token', tokens.refresh_token, { httpOnly: true });
    
    return response;
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}