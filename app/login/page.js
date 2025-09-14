'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { setTokens } from '@/lib/api';
import { setTokens } from '../lib/api';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use client credentials flow to get access token directly
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store tokens and redirect to dashboard
      setTokens(data.access_token, data.refresh_token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Authentication failed. Please check your VPN connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            EHR Integration Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access DrChrono EHR Data
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Connecting...' : 'Connect to DrChrono API'}
            </button>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>API Authentication:</strong> Using client credentials to access DrChrono sandbox environment.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Note: You need to use a US VPN to access the API
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Use the provided ProtonVPN credentials to connect to a US server first
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}