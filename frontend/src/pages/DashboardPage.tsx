// frontend/src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [role, setRole] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const endpoints = ['farm-manager', 'site-manager', 'vet', 'inventory', 'bod'];
    const selectedEndpoint = endpoints[role];

    const token = localStorage.getItem('token') || '';
    fetch(`/api/dashboard/${selectedEndpoint}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        setData(resData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Poultry Farm Operational Dashboards</h1>

      <Tabs selectedIndex={role} onSelect={(index) => setRole(index)}>
        <TabList>
          <Tab>Farm Manager</Tab>
          <Tab>Site Manager</Tab>
          <Tab>Veterinarian / Tech</Tab>
          <Tab>Inventory Staff</Tab>
          <Tab>BOD / Exec Admin</Tab>
        </TabList>

        {/* Farm Manager Dashboard */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Farm Manager Overview</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading dashboard metrics...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded bg-white shadow-sm">
                  <div className="text-sm text-gray-500">Active Flocks</div>
                  <div className="text-2xl font-bold">{data?.activeFlocksCount ?? '—'}</div>
                </div>
                <div className="p-4 border rounded bg-white shadow-sm">
                  <div className="text-sm text-gray-500">Current Population</div>
                  <div className="text-2xl font-bold">{data?.currentPopulation?.toLocaleString() ?? '—'} birds</div>
                </div>
                <div className="p-4 border rounded bg-white shadow-sm">
                  <div className="text-sm text-gray-500">Hen-Day Production (HDP)</div>
                  <div className="text-2xl font-bold text-blue-600">{data?.hdp ?? '—'}%</div>
                </div>
                <div className="p-4 border rounded bg-white shadow-sm">
                  <div className="text-sm text-gray-500">Pending Approvals</div>
                  <div className="text-2xl font-bold text-orange-600">{data?.pendingApprovalsCount ?? 0}</div>
                </div>
              </div>

              <div className="p-4 border rounded bg-white">
                <h3 className="text-md font-bold mb-4">Production Trend (HDP)</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={data?.productionTrend || [
                      { date: '2026-09-18', hdp: 88.0 },
                      { date: '2026-09-19', hdp: 89.5 },
                      { date: '2026-09-20', hdp: 89.1 },
                      { date: '2026-09-21', hdp: 90.2 },
                      { date: '2026-09-22', hdp: 90.8 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="hdp" stroke="#2563eb" strokeWidth={2} name="HDP (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </TabPanel>

        {/* Site Manager Dashboard */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Site Manager Overview & House Comparison</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading house comparison...</div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 border rounded bg-white">
                <h3 className="text-md font-bold mb-4">House Performance Comparison (HDP %)</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data?.housesComparison || [
                      { houseName: 'House 1', hdp: 89.2 },
                      { houseName: 'House 2', hdp: 91.5 },
                      { houseName: 'House 3', hdp: 87.8 },
                      { houseName: 'House 4', hdp: 90.4 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="houseName" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="hdp" fill="#10b981" name="Hen-Day Production (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </TabPanel>

        {/* Vet Dashboard */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Veterinary & Health Status</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading vet analytics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded bg-white shadow-sm">
                <h3 className="font-bold mb-3">Mortality Causes Breakdown</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-2">Cause</th>
                      <th className="p-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.mortalityCauses || []).map((m: any, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{m.cause}</td>
                        <td className="p-2 font-medium">{m.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border rounded bg-white shadow-sm">
                <h3 className="font-bold mb-3">Biosecurity & Vaccine Status</h3>
                <div className="text-sm space-y-2">
                  <div>Biosecurity Score: <span className="font-bold text-green-600">{data?.biosecurityScore || '96%'}</span></div>
                  <div>Active Medications: <span className="font-bold">{data?.medicationStatus?.activeAdministrations || 0}</span></div>
                  <div>Scheduled Vaccinations: <span className="font-bold">{data?.vaccinationStatus?.scheduledThisWeek || 0}</span></div>
                </div>
              </div>
            </div>
          )}
        </TabPanel>

        {/* Inventory Staff Dashboard */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Inventory & Feed Stock Status</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading stock inventory...</div>
          ) : (
            <div className="p-4 border rounded bg-white shadow-sm">
              <h3 className="font-bold mb-3">Feed Stock Summary</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-2">Feed Product</th>
                    <th className="p-2">Current Stock (kg)</th>
                    <th className="p-2">Min Threshold (kg)</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.feedStockSummary || []).map((item: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.item}</td>
                      <td className="p-2">{item.stockKg.toLocaleString()}</td>
                      <td className="p-2">{item.minThresholdKg.toLocaleString()}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${item.status === 'Low Stock' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>

        {/* BOD / Exec Admin Dashboard */}
        <TabPanel>
          <h2 className="text-xl font-semibold my-4">Executive & Multi-Farm Performance</h2>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading BOD metrics...</div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 border rounded bg-white">
                <h3 className="text-md font-bold mb-4">Multi-Farm Comparison</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data?.farmComparison || [
                      { farmName: 'North Layer Farm', hdp: 91.2, fcr: 1.92 },
                      { farmName: 'South Layer Farm', hdp: 88.7, fcr: 2.01 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="farmName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hdp" fill="#3b82f6" name="HDP (%)" />
                      <Bar dataKey="fcr" fill="#8b5cf6" name="FCR" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
