// frontend/src/api/mobileApi.ts

function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function fetchNotifications() {
  const res = await fetch('/api/mobile/notifications', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function markNotificationAsRead(id: string) {
  const res = await fetch(`/api/mobile/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function syncOfflineQueue(items: any[]) {
  const res = await fetch('/api/mobile/sync', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('Failed to process sync queue');
  return res.json();
}
