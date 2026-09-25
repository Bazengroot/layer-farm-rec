// frontend/src/pages/OperationalTasksPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchOperationalTasks, updateTaskStatus } from '../api/operationsApi';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';

export const OperationalTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadData = () => {
    setLoading(true);
    fetchOperationalTasks(statusFilter)
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to update task status');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Farm Operational Tasks</h1>
          <p className="text-sm text-gray-500">Task templates, daily routines, biosecurity & maintenance schedules</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary" onClick={() => exportCsv(tasks, 'operational_tasks')}>Export CSV</button>
          <button className="btn-secondary" onClick={() => exportPdf(tasks, 'Tasks Report', 'operational_tasks')}>Export PDF</button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-4 items-center bg-gray-50 p-3 border rounded">
        <label className="text-sm font-medium">Status Filter:</label>
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Verified">Verified</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading operational tasks...</div>
      ) : (
        <div className="bg-white border rounded shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-sm">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="p-3 text-sm">{task.category}</td>
                  <td className="p-3 text-sm">{task.location || 'Farm wide'}</td>
                  <td className="p-3 text-sm">{task.due_date}</td>
                  <td className="p-3 text-xs font-semibold uppercase">{task.priority || 'medium'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'Verified' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {task.status !== 'Completed' && task.status !== 'Verified' && (
                      <button
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 mr-1"
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                      >
                        Complete
                      </button>
                    )}
                    {task.status === 'Completed' && (
                      <button
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleStatusChange(task.id, 'Verified')}
                      >
                        Verify
                      </button>
                    )}
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

export default OperationalTasksPage;
