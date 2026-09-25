// src/pages/HealthManagementPage.tsx

import React, { useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';
import {
  fetchDailyHealth,
  fetchMedication,
  fetchVaccination,
  fetchBiosecurity,
  fetchFlocks,
  fetchPerformanceKPIs,
} from '../api/healthApi';
import { MedicationFilter } from '../components/MedicationFilter';
import KpiCard from '../components/KpiCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * Health Management UI – provides five tabs:
 *   1. Daily Health Records
 *   2. Medication Administration
 *   3. Vaccination Records
 *   4. Bio‑security Checklist
 *   5. Performance KPI & Analytics
 */
const HealthManagementPage: React.FC = () => {
  const [filters, setFilters] = useState<{ farmId?: string; warehouseId?: string }>({});
  const [daily, setDaily] = useState<any[]>([]);
  const [medication, setMedication] = useState<any[]>([]);
  const [vaccination, setVaccination] = useState<any[]>([]);
  const [biosecurity, setBiosecurity] = useState<any[]>([]);

  // Flock & KPI states
  const [flocks, setFlocks] = useState<any[]>([]);
  const [selectedFlockId, setSelectedFlockId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [kpis, setKpis] = useState<any[]>([]);
  const [loadingKpis, setLoadingKpis] = useState<boolean>(false);

  // Load health data and flock options on mount / filter change
  useEffect(() => {
    fetchDailyHealth().then(setDaily).catch(console.error);
    fetchMedication(undefined as any, filters).then(setMedication).catch(console.error);
    fetchVaccination().then(setVaccination).catch(console.error);
    fetchBiosecurity().then(setBiosecurity).catch(console.error);
    fetchFlocks()
      .then((data) => {
        setFlocks(data || []);
        if (data && data.length > 0 && !selectedFlockId) {
          setSelectedFlockId(data[0].id);
        }
      })
      .catch(console.error);
  }, [filters]);

  const handleLoadKPIs = async () => {
    if (!selectedFlockId) {
      alert('Please select a flock first');
      return;
    }
    setLoadingKpis(true);
    try {
      const data = await fetchPerformanceKPIs(selectedFlockId, startDate, endDate);
      setKpis(data || []);
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    } finally {
      setLoadingKpis(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Health & Performance Management</h1>
      <Tabs>
        <TabList>
          <Tab>Daily Health</Tab>
          <Tab>Medication</Tab>
          <Tab>Vaccination</Tab>
          <Tab>Bio‑security</Tab>
          <Tab>Performance KPI</Tab>
        </TabList>

        <TabPanel>
          <h2 className="text-xl mb-2">Daily Health Records</h2>
          <div className="flex space-x-2 mb-2">
            <button className="btn-secondary" onClick={() => exportCsv(daily, 'daily_health')}>
              Export CSV
            </button>
            <button className="btn-secondary" onClick={() => exportPdf(daily, 'Daily Health', 'daily_health')}>
              Export PDF
            </button>
          </div>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Date</th>
                <th className="p-2">Mortality</th>
                <th className="p-2">Culling</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.record_date}</td>
                  <td className="p-2">{r.mortality}</td>
                  <td className="p-2">{r.culling}</td>
                  <td className="p-2">{r.veterinarian_notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <h2 className="text-xl mb-2">Medication Administration</h2>
          <div className="flex space-x-2 mb-2">
            <button className="btn-secondary" onClick={() => exportCsv(medication, 'medication')}>
              Export CSV
            </button>
            <button className="btn-secondary" onClick={() => exportPdf(medication, 'Medication', 'medication')}>
              Export PDF
            </button>
          </div>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Date</th>
                <th className="p-2">Product</th>
                <th className="p-2">Dosage</th>
                <th className="p-2">Veterinarian</th>
              </tr>
            </thead>
            <tbody>
              {medication.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.admin_date}</td>
                  <td className="p-2">{r.medication_product_id}</td>
                  <td className="p-2">
                    {r.dosage_amount} {r.dosage_unit_id}
                  </td>
                  <td className="p-2">{r.administered_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <h2 className="text-xl mb-2">Vaccination Records</h2>
          <div className="flex space-x-2 mb-2">
            <button className="btn-secondary" onClick={() => exportCsv(vaccination, 'vaccination')}>
              Export CSV
            </button>
            <button className="btn-secondary" onClick={() => exportPdf(vaccination, 'Vaccination', 'vaccination')}>
              Export PDF
            </button>
          </div>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Date</th>
                <th className="p-2">Vaccine</th>
                <th className="p-2">Dosage</th>
                <th className="p-2">Veterinarian</th>
              </tr>
            </thead>
            <tbody>
              {vaccination.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.admin_date}</td>
                  <td className="p-2">{r.vaccine_id}</td>
                  <td className="p-2">
                    {r.dosage_amount} {r.dosage_unit_id}
                  </td>
                  <td className="p-2">{r.administered_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <h2 className="text-xl mb-2">Bio‑security Checklist</h2>
          <button className="btn-primary mb-2" onClick={() => alert('Open biosecurity modal')}>
            Add Checklist
          </button>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Performed At</th>
                <th className="p-2">Template</th>
                <th className="p-2">Results</th>
              </tr>
            </thead>
            <tbody>
              {biosecurity.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{new Date(r.performed_at).toLocaleString()}</td>
                  <td className="p-2">{r.template_id}</td>
                  <td className="p-2">{JSON.stringify(r.results)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        {/* Phase 7: Performance KPI & Analytics Tab */}
        <TabPanel>
          <h2 className="text-xl mb-4 font-semibold">Flock Performance KPI & Analytics</h2>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-end mb-6 p-4 bg-gray-50 border rounded">
            <div>
              <label className="block text-sm font-medium mb-1">Select Flock</label>
              <select
                className="border p-2 rounded min-w-[200px]"
                value={selectedFlockId}
                onChange={(e) => setSelectedFlockId(e.target.value)}
              >
                <option value="">-- Choose Flock --</option>
                {flocks.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name || `Flock ${f.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleLoadKPIs}
              disabled={loadingKpis}
            >
              {loadingKpis ? 'Loading...' : 'Load KPIs'}
            </button>
          </div>

          {/* KPI Display Cards */}
          {kpis.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Key Performance Indicators</h3>
                <div className="flex space-x-2">
                  <button className="btn-secondary" onClick={() => exportCsv(kpis, 'performance_kpis')}>
                    Export CSV
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => exportPdf(kpis, 'Performance KPIs Report', 'performance_kpis')}
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => (
                  <KpiCard
                    key={kpi.code}
                    title={kpi.name}
                    value={kpi.value}
                    unit={kpi.unit}
                    formula={kpi.formula}
                    warnings={kpi.warnings}
                    completeness={kpi.completeness}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recharts Analytics Visualization */}
          {kpis.length > 0 && (
            <div className="p-4 border rounded bg-white mt-6">
              <h3 className="text-md font-bold mb-4">KPI Summary Chart</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={kpis.filter((item) => typeof item.value === 'number')}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default HealthManagementPage;
