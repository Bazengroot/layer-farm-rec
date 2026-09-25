// frontend/src/pages/ReportsPage.tsx

import React, { useState } from 'react';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<string>('daily_flock');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    try {
      const query = new URLSearchParams({ type: reportType, startDate, endDate });
      const res = await fetch(`/api/reports/data?${query.toString()}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Error generating report', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Poultry Farm Operational Reports</h1>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 border rounded shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Report Type</label>
          <select
            className="border p-2 rounded min-w-[220px]"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="daily_flock">Daily Flock Report</option>
            <option value="weekly_production">Weekly Production Report</option>
            <option value="monthly_production">Monthly Production Report</option>
            <option value="flock_performance">Flock Performance Report</option>
            <option value="farm_comparison">Farm Comparison Report</option>
            <option value="house_comparison">House Comparison Report</option>
            <option value="feed_performance">Feed Performance Report</option>
            <option value="mortality_analysis">Mortality Analysis Report</option>
            <option value="egg_quality">Egg Quality Analysis</option>
            <option value="cost_analysis">Cost Analysis Report</option>
            <option value="data_completeness">Data Completeness Report</option>
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
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="bg-white p-6 border rounded shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-xl font-bold">{reportData.reportType || 'Performance Report'}</h2>
              <p className="text-xs text-gray-500">Generated at: {new Date(reportData.generatedAt).toLocaleString()}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="btn-secondary"
                onClick={() => exportCsv(reportData.rows || [], reportType)}
              >
                Export CSV
              </button>
              <button
                className="btn-secondary"
                onClick={() => exportPdf(reportData.rows || [], reportData.reportType, reportType)}
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Summary Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded text-sm">
            <div>Average HDP: <span className="font-bold">{reportData.summary?.averageHdp || 'N/A'}</span></div>
            <div>Total Mortality: <span className="font-bold">{reportData.summary?.totalMortality || 0}</span></div>
            <div>Total Feed: <span className="font-bold">{reportData.summary?.totalFeedKg?.toLocaleString() || 0} kg</span></div>
            <div>Completeness: <span className="font-bold text-green-700">{reportData.summary?.dataCompleteness || '100%'}</span></div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2">Date</th>
                <th className="p-2">Flock</th>
                <th className="p-2">HDP (%)</th>
                <th className="p-2">HHP (%)</th>
                <th className="p-2">Mortality</th>
                <th className="p-2">Culling</th>
                <th className="p-2">Feed (kg)</th>
                <th className="p-2">FCR</th>
              </tr>
            </thead>
            <tbody>
              {(reportData.rows || []).map((row: any, idx: number) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">{row.date}</td>
                  <td className="p-2 font-medium">{row.flockName}</td>
                  <td className="p-2">{row.hdp}%</td>
                  <td className="p-2">{row.hhp}%</td>
                  <td className="p-2">{row.mortality}</td>
                  <td className="p-2">{row.culling}</td>
                  <td className="p-2">{row.feedKg} kg</td>
                  <td className="p-2">{row.fcr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
