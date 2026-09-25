// frontend/src/pages/GlobalSearchPage.tsx

import React, { useState } from 'react';

export const GlobalSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [recordType, setRecordType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);

    setTimeout(() => {
      // Mock global search results across operational data
      setResults([
        { id: '1', type: 'daily_health', flock: 'Flock A-1', house: 'House 1', date: '2026-09-24', status: 'Approved', summary: 'Mortality: 2, Good Eggs: 9,800, Feed: 1,200 kg' },
        { id: '2', type: 'expense', flock: 'Flock B-2', house: 'House 2', date: '2026-09-23', status: 'Approved', summary: 'Feed Expense - Vendor: LayerFeeds Corp ($2,400)' },
        { id: '3', type: 'inventory', flock: 'General Warehouse', house: 'Main Site', date: '2026-09-22', status: 'Completed', summary: 'Vaccine Issue - Newcastle Vaccine (10 Vials)' },
      ]);
      setSearching(false);
    }, 300);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Global Operational Search & Filter</h1>
        <p className="text-sm text-gray-500">Query records across Farm, Site, House, Flock, Date, Status, Recorder & Record Type</p>
      </div>

      <form onSubmit={handleSearch} className="bg-gray-50 p-4 border rounded shadow-sm space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search keywords, flock name, vendor, record ID..."
            className="flex-1 border p-3 rounded-lg text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block font-medium mb-1">Record Type</label>
            <select className="w-full border p-2 rounded" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
              <option value="all">All Record Types</option>
              <option value="daily_health">Daily Health & Production</option>
              <option value="expense">Expenses & Allocations</option>
              <option value="inventory">Inventory Movements</option>
              <option value="task">Operational Tasks</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Status</label>
            <select className="w-full border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </form>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((res) => (
          <div key={res.id} className="bg-white p-4 border rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="flex space-x-2 items-center">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">{res.type}</span>
                <span className="text-sm font-semibold">{res.flock} ({res.house})</span>
              </div>
              <p className="text-sm mt-1 text-gray-700">{res.summary}</p>
              <span className="text-xs text-gray-400 mt-1 block">Record Date: {res.date}</span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
              {res.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalSearchPage;
