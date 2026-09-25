// frontend/src/api/healthApi.ts

function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error (${res.status}): ${err}`);
  }
  return res.json();
}

export async function fetchDailyHealth() {
  const res = await fetch('/api/health/daily', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchMedication(_param?: any, filters?: any) {
  const query = new URLSearchParams(filters || {}).toString();
  const res = await fetch(`/api/health/medication?${query}`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchVaccination() {
  const res = await fetch('/api/health/vaccination', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBiosecurity() {
  const res = await fetch('/api/health/biosecurity', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

/** Performance KPI fetch */
export async function fetchFlocks() {
  const res = await fetch('/api/flocks', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch flocks: ${err}`);
  }
  const data = await res.json();
  return data.flocks || data;
}

export async function fetchPerformanceKPIs(flockId: string, startDate: string, endDate: string) {
  const params = new URLSearchParams({ flockId, startDate, endDate });
  const res = await fetch(`/api/performance/kpis?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch performance KPIs');
  return res.json();
}
