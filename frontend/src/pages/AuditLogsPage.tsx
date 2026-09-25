// frontend/src/pages/AuditLogsPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../api/workflowApi';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [entityFilter, setEntityFilter] = useState<string>('');

  const loadLogs = () => {
    setLoading(true);
    fetchAuditLogs(entityFilter)
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, [entityFilter]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Audit Logs</h1>
          <p className="text-sm text-gray-500">Immutable trail of record creations, approvals, corrections, evidence & permission changes</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary" onClick={() => exportCsv(logs, 'system_audit_logs')}>Export CSV</button>
          <button className="btn-secondary" onClick={() => exportPdf(logs, 'System Audit Logs Report', 'system_audit_logs')}>Export PDF</button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center bg-gray-50 p-3 border rounded">
        <label className="text-sm font-medium">Filter Entity:</label>
        <input
          type="text"
          placeholder="e.g. daily_health, expense, evidence"
          className="border p-2 rounded text-sm w-64"
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading audit trail...</div>
      ) : (
        <div className="bg-white border rounded shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity Type</th>
                <th className="p-3">Entity ID</th>
                <th className="p-3">Details / Changes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-3 font-bold text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 rounded border">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs">{log.entity_type}</td>
                  <td className="p-3 font-mono text-xs">{log.entity_id || '—'}</td>
                  <td className="p-3 text-xs font-mono text-gray-700 max-w-md truncate">
                    {JSON.stringify(log.changes_json)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;
