// frontend/src/pages/ExpensesAllocationPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchExpenses, createExpense } from '../api/operationsApi';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';

export const ExpensesAllocationPage: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [category, setCategory] = useState<string>('Feed');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [vendor, setVendor] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  const [costCenter, setCostCenter] = useState<string>('Main Layer Farm');
  const [notes, setNotes] = useState<string>('');

  const loadData = () => {
    setLoading(true);
    fetchExpenses()
      .then(setExpenses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense({
        expense_category: category,
        amount,
        currency,
        vendor_name: vendor,
        invoice_number: invoice,
        cost_center: costCenter,
        notes,
        allocations: [
          { allocation_target_type: 'farm', allocation_percentage: 100 },
        ],
      });
      setShowModal(false);
      setAmount(0);
      setVendor('');
      setInvoice('');
      setNotes('');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to record expense');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Farm Expenses & Cost Allocation</h1>
          <p className="text-sm text-gray-500">Track costs by category, cost center, and transparent allocation rules</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowModal(true)}>
            Record Expense
          </button>
          <button className="btn-secondary" onClick={() => exportCsv(expenses, 'farm_expenses')}>Export CSV</button>
          <button className="btn-secondary" onClick={() => exportPdf(expenses, 'Farm Expenses Report', 'farm_expenses')}>Export PDF</button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading expenses...</div>
      ) : (
        <div className="bg-white border rounded shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-sm">
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Vendor / Invoice</th>
                <th className="p-3">Cost Center</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">{exp.expense_date}</td>
                  <td className="p-3 font-medium">{exp.expense_category}</td>
                  <td className="p-3 text-sm">{exp.vendor_name || 'N/A'} {exp.invoice_number ? `(#${exp.invoice_number})` : ''}</td>
                  <td className="p-3 text-sm">{exp.cost_center || 'General'}</td>
                  <td className="p-3 font-bold text-green-700">{exp.currency || '$'} {Number(exp.amount).toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded uppercase font-semibold">
                      {exp.payment_status || 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold">Record Farm Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Expense Category</label>
                <select
                  className="w-full border p-2 rounded"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Feed">Feed</option>
                  <option value="Medication">Medication</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Labor">Labor</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vendor Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Invoice Number</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cost Center</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesAllocationPage;
