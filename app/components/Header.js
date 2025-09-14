'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">EHR Dashboard</h1>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            Disconnect
          </button>
        </div>
      </div>
    </header>
  );
}