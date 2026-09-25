// frontend/src/api/workflowApi.ts

function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

// Approvals
export async function fetchPendingApprovals() {
  const res = await fetch('/api/workflow/approval/pending', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function submitApprovalRequest(payload: any) {
  const res = await fetch('/api/workflow/approval/submit', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit approval request');
  return res.json();
}

export async function reviewApprovalRequest(payload: any) {
  const res = await fetch('/api/workflow/approval/review', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to review approval request');
  return res.json();
}

// Corrections
export async function fetchCorrectionHistory(recordType?: string, recordId?: string) {
  const params = new URLSearchParams();
  if (recordType) params.append('recordType', recordType);
  if (recordId) params.append('recordId', recordId);

  const res = await fetch(`/api/workflow/correction/history?${params.toString()}`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function requestCorrection(payload: any) {
  const res = await fetch('/api/workflow/correction/request', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to request correction');
  return res.json();
}

export async function reviewCorrection(payload: any) {
  const res = await fetch('/api/workflow/correction/review', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to review correction');
  return res.json();
}

// Evidence
export async function registerEvidence(payload: any) {
  const res = await fetch('/api/workflow/evidence/register', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to register evidence');
  return res.json();
}

export async function fetchEvidence(entityType: string, entityId: string) {
  const res = await fetch(`/api/workflow/evidence?entityType=${entityType}&entityId=${entityId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}

// Audit Logs
export async function fetchAuditLogs(entityType?: string, limit = 50) {
  const query = new URLSearchParams();
  if (entityType) query.append('entityType', entityType);
  query.append('limit', String(limit));

  const res = await fetch(`/api/workflow/audit-logs?${query.toString()}`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}
