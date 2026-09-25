// frontend/src/api/operationsApi.ts

function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

// Inventory
export async function fetchInventoryItems() {
  const res = await fetch('/api/operations/inventory', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function createInventoryTransaction(txData: any) {
  const res = await fetch('/api/operations/inventory/transaction', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(txData),
  });
  if (!res.ok) throw new Error('Failed to record transaction');
  return res.json();
}

// Expenses
export async function fetchExpenses() {
  const res = await fetch('/api/operations/expenses', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function createExpense(expenseData: any) {
  const res = await fetch('/api/operations/expenses', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(expenseData),
  });
  if (!res.ok) throw new Error('Failed to record expense');
  return res.json();
}

// Tasks
export async function fetchOperationalTasks(status?: string) {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`/api/operations/tasks${query}`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function updateTaskStatus(taskId: string, statusData: any) {
  const res = await fetch(`/api/operations/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(statusData),
  });
  if (!res.ok) throw new Error('Failed to update task status');
  return res.json();
}

// Equipment & Workforce
export async function fetchEquipment() {
  const res = await fetch('/api/operations/equipment', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchEmployees() {
  const res = await fetch('/api/operations/workforce', { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return res.json();
}
