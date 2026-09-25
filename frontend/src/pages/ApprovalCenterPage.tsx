// frontend/src/pages/ApprovalCenterPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchPendingApprovals, reviewApprovalRequest } from '../api/workflowApi';

export const ApprovalCenterPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  const loadData = () => {
    setLoading(true);
    fetchPendingApprovals()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewAction = async (requestId: string, action: 'Approved' | 'Rejected' | 'Correction Requested' | 'Cancelled') => {
    try {
      await reviewApprovalRequest({
        request_id: requestId,
        reviewer_id: '00000000-0000-0000-0000-000000000000',
        action,
        notes: reviewNotes[requestId] || '',
      });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operational Approval Center</h1>
        <p className="text-sm text-gray-500">Multi-stage approvals for daily records, feed requests, expenses, transfers & closures</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading pending approval requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-8 border rounded text-center text-gray-500">
          No pending approvals requiring review.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-4 border rounded shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                    {req.record_type}
                  </span>
                  <h3 className="text-lg font-bold mt-1">Record ID: {req.record_id}</h3>
                  <p className="text-xs text-gray-500">Submitted: {new Date(req.created_at).toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded">
                  Status: {req.status}
                </span>
              </div>

              {req.notes && (
                <div className="text-xs bg-gray-50 p-2 rounded border">
                  <strong>Submitter Notes:</strong> {req.notes}
                </div>
              )}

              <div className="pt-2 border-t flex flex-col md:flex-row gap-3 items-end">
                <input
                  type="text"
                  placeholder="Reviewer notes..."
                  className="border p-2 text-xs rounded flex-1"
                  value={reviewNotes[req.id] || ''}
                  onChange={(e) => setReviewNotes({ ...reviewNotes, [req.id]: e.target.value })}
                />
                <div className="flex space-x-2">
                  <button
                    className="bg-green-600 text-white text-xs px-3 py-2 rounded font-bold hover:bg-green-700"
                    onClick={() => handleReviewAction(req.id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-amber-600 text-white text-xs px-3 py-2 rounded font-bold hover:bg-amber-700"
                    onClick={() => handleReviewAction(req.id, 'Correction Requested')}
                  >
                    Request Correction
                  </button>
                  <button
                    className="bg-red-600 text-white text-xs px-3 py-2 rounded font-bold hover:bg-red-700"
                    onClick={() => handleReviewAction(req.id, 'Rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalCenterPage;
