'use client';

import { useState, useEffect } from 'react';
import { appointmentsApi, patientsApi } from '@/lib/api';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.list({ date: dateFilter });
      setAppointments(data.results || []);
      setError('');

      // Fetch patient details for each appointment
      if (data.results && data.results.length > 0) {
        const patientIds = [...new Set(data.results.map(appt => appt.patient))];
        await fetchPatientDetails(patientIds);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please check your connection and VPN.');
      if (error.message.includes('401') || error.message.includes('403')) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientIds) => {
    try {
      const patientDetails = {};
      for (const patientId of patientIds) {
        if (patientId) {
          const patientData = await patientsApi.get(patientId);
          patientDetails[patientId] = patientData;
        }
      }
      setPatients(patientDetails);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  const getPatientName = (patientId) => {
    if (!patientId || !patients[patientId]) return 'Unknown Patient';
    const patient = patients[patientId];
    return `${patient.first_name} ${patient.last_name}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
            Filter by Date:
          </label>
          <input
            type="date"
            id="date-filter"
            value={dateFilter}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No appointments found for {new Date(dateFilter).toLocaleDateString()}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getPatientName(appt.patient)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appt.scheduled_time ? new Date(appt.scheduled_time).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appt.duration || 'N/A'} minutes
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appt.status === 'Confirmed' || appt.status === 'Scheduled' 
                        ? 'bg-green-100 text-green-800'
                        : appt.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appt.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {appt.reason || 'N/A'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}