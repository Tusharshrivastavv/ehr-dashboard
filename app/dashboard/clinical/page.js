'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { patientsApi, clinicalApi } from '@/lib/api';

export default function Clinical() {
  const [selectedTab, setSelectedTab] = useState('notes');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [clinicalData, setClinicalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.list({ limit: 50 });
      setPatients(data.results || []);
      setError('');
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients. Please check your connection and VPN.');
      if (error.message.includes('401') || error.message.includes('403')) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicalData = async (patientId) => {
    try {
      setLoading(true);
      const data = await clinicalApi.getPatientSummary(patientId);
      setClinicalData(data);
      setError('');
    } catch (error) {
      console.error('Error fetching clinical data:', error);
      setError('Failed to fetch clinical data. This feature might not be available in the sandbox.');
      setClinicalData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    if (patientId) {
      fetchClinicalData(patientId);
    } else {
      setClinicalData(null);
    }
  };

  if (loading && !clinicalData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Clinical</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Patient
        </label>
        <select
          id="patient-select"
          value={selectedPatient?.id || ''}
          onChange={(e) => handlePatientSelect(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name} ({patient.date_of_birth})
            </option>
          ))}
        </select>
      </div>

      {selectedPatient && (
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
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {selectedTab === 'notes' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Clinical Notes</h2>
                    {clinicalData?.notes ? (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <pre className="whitespace-pre-wrap">{clinicalData.notes}</pre>
                      </div>
                    ) : (
                      <p className="text-gray-600">No clinical notes available for this patient.</p>
                    )}
                  </div>
                )}
                
                {selectedTab === 'vitals' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Vital Signs</h2>
                    {clinicalData?.vitals ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(clinicalData.vitals).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium text-gray-800 capitalize">{key.replace(/_/g, ' ')}</h3>
                            <p className="text-lg">{value}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No vital signs recorded for this patient.</p>
                    )}
                  </div>
                )}
                
                {selectedTab === 'medications' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Medications</h2>
                    {clinicalData?.medications?.length > 0 ? (
                      <div className="space-y-3">
                        {clinicalData.medications.map((med, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium text-gray-800">{med.name}</h3>
                            <p className="text-sm">Dosage: {med.dosage}</p>
                            <p className="text-sm">Frequency: {med.frequency}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No medications recorded for this patient.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {!selectedPatient && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Please select a patient to view clinical data</p>
        </div>
      )}
    </div>
  );
}