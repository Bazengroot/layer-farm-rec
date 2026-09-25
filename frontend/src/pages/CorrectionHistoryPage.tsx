// frontend/src/pages/CorrectionHistoryPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchCorrectionHistory, reviewCorrection } from '../api/workflowApi';

export const CorrectionHistoryPage: React.FC = () => {
  const [corrections, setCorrections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);
    fetchCorrectionHistory()
      .then(setCorrections)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReview = async (correctionId: string, approved: boolean) => {
    try {
      await reviewCorrection({
        correctionId,
        reviewerId: '00000000-0000-0000-0000-000000000000',
        approved,
      });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to review correction');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Record Correction Audit Trail</h1>
        <p className="text-sm text-gray-500">Non-destructive historical record edits with full original state preservation</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading correction requests...</div>
      ) : corrections.length === 0 ? (
        <div className="bg-white p-8 border rounded text-center text-gray-500">No correction history records found.</div>
      ) : (
        <div className="space-y-4">
          {corrections.map((item) => (
            <div key={item.id} className="bg-white p-4 border rounded shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded uppercase">
                    {item.record_type}
                  </span>
                  <span className="ml-2 text-xs font-mono text-gray-500">Record ID: {item.record_id}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="text-xs bg-amber-50 p-2 border border-amber-200 rounded">
                <strong>Reason for Correction:</strong> {item.reason}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-2 border rounded bg-red-50">
                  <div className="font-bold text-red-800 mb-1">Original Data (Preserved)</div>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(item.original_data, null, 2)}</pre>
                </div>
                <div className="p-2 border rounded bg-green-50">
                  <div className="font-bold text-green-800 mb-1">Proposed Corrected Data</div>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(item.proposed_data, null, 2)}</pre>
                </div>
              </div>

              {item.status === 'Pending' && (
                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button
                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-green-700"
                    onClick={() => handleReview(item.id, true)}
                  >
                    Approve Correction
                  </button>
                  <button
                    className="bg-red-600 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-red-700"
                    onClick={() => handleReview(item.id, false)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorrectionHistoryPage;
