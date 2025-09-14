'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setError('');
    
    const clientId = process.env.NEXT_PUBLIC_DRCHRONO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DRCHRONO_REDIRECT_URI;
    
    const authUrl = `https://drchrono.com/o/authorize/?redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            EHR Integration Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your DrChrono account
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
              {isLoading ? 'Redirecting...' : 'Sign in with DrChrono'}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Note: You need to use a US VPN to access the API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}