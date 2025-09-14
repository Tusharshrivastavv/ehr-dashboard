'use client';

import { useState } from 'react';

export default function Clinical() {
  const [selectedTab, setSelectedTab] = useState('notes');

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Clinical</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('notes')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'notes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clinical Notes
            </button>
            <button
              onClick={() => setSelectedTab('vitals')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'vitals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vital Signs
            </button>
            <button
              onClick={() => setSelectedTab('medications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'medications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medications
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'notes' && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Clinical Notes</h2>
              <p className="text-gray-600">Clinical notes functionality will be implemented here.</p>
            </div>
          )}
          
          {selectedTab === 'vitals' && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Vital Signs</h2>
              <p className="text-gray-600">Vital signs recording functionality will be implemented here.</p>
            </div>
          )}
          
          {selectedTab === 'medications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Medications</h2>
              <p className="text-gray-600">Medication management functionality will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}