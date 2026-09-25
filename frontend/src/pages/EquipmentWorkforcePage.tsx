// frontend/src/pages/EquipmentWorkforcePage.tsx

import React, { useEffect, useState } from 'react';
import { fetchEquipment, fetchEmployees } from '../api/operationsApi';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export const EquipmentWorkforcePage: React.FC = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEquipment(), fetchEmployees()])
      .then(([eq, emp]) => {
        setEquipment(eq);
        setEmployees(emp);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Equipment & Workforce Management</h1>

      <Tabs>
        <TabList>
          <Tab>Farm Equipment & Preventive Maintenance</Tab>
          <Tab>Workforce & Certifications</Tab>
        </TabList>

        {/* Equipment Tab */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Farm Machinery & Equipment</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading equipment...</div>
          ) : (
            <div className="bg-white border rounded shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b text-sm">
                    <th className="p-3">Equipment Name</th>
                    <th className="p-3">Serial No</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Condition</th>
                    <th className="p-3">Next Maintenance</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((eq) => (
                    <tr key={eq.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{eq.name}</td>
                      <td className="p-3 font-mono text-xs">{eq.serial_number || 'N/A'}</td>
                      <td className="p-3 text-sm">{eq.location || 'Farm Wide'}</td>
                      <td className="p-3 text-sm">{eq.condition_status || 'Good'}</td>
                      <td className="p-3 text-sm font-semibold text-blue-600">{eq.next_maintenance_date || 'Scheduled'}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-bold">
                          {eq.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>

        {/* Workforce Tab */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Employee Roster & Certifications</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading employee roster...</div>
          ) : (
            <div className="bg-white border rounded shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b text-sm">
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Attendance Ref</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{emp.full_name}</td>
                      <td className="p-3 text-sm">{emp.department}</td>
                      <td className="p-3 text-sm">{emp.position}</td>
                      <td className="p-3 text-sm font-semibold">{emp.shift || 'Day'}</td>
                      <td className="p-3 text-xs font-mono">{emp.attendance_reference || 'REF-EMP'}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-bold">
                          {emp.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default EquipmentWorkforcePage;
