// frontend/src/pages/InventoryManagementPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchInventoryItems, createInventoryTransaction } from '../api/operationsApi';
import { exportCsv } from '../utils/exportCsv';
import { exportPdf } from '../utils/exportPdf';

export const InventoryManagementPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [txType, setTxType] = useState<string>('receiving');
  const [quantity, setQuantity] = useState<number>(0);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const loadData = () => {
    setLoading(true);
    fetchInventoryItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || quantity <= 0) {
      alert('Please select an item and enter a valid quantity.');
      return;
    }
    try {
      await createInventoryTransaction({
        item_id: selectedItemId,
        transaction_type: txType,
        quantity,
        unit_cost: unitCost,
        notes,
      });
      setShowModal(false);
      setQuantity(0);
      setNotes('');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to submit inventory transaction');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">General Farm Inventory</h1>
          <p className="text-sm text-gray-500">Medicines, Vaccines, Disinfectants, PPE, Packaging, Crates & Spare Parts</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowModal(true)}>
            Record Movement
          </button>
          <button className="btn-secondary" onClick={() => exportCsv(items, 'general_inventory')}>Export CSV</button>
          <button className="btn-secondary" onClick={() => exportPdf(items, 'Inventory Report', 'general_inventory')}>Export PDF</button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading stock inventory...</div>
      ) : (
        <div className="bg-white border rounded shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-sm">
                <th className="p-3">Item Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Min Threshold</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isLow = item.current_stock <= (item.min_stock_threshold || 10);
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{item.item_code}</td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-sm text-gray-600">{item.category?.name || 'General'}</td>
                    <td className="p-3 font-bold">{item.current_stock} {item.unit_of_measure}</td>
                    <td className="p-3 text-sm">{item.min_stock_threshold} {item.unit_of_measure}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${isLow ? 'bg-red-100 text-red-700 font-bold' : 'bg-green-100 text-green-700'}`}>
                        {isLow ? 'Low Stock Alert' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold">Record Inventory Movement</h3>
            <form onSubmit={handleTransactionSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Select Item</label>
                <select
                  className="w-full border p-2 rounded"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Item --</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>{i.name} ({i.item_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Transaction Type</label>
                <select
                  className="w-full border p-2 rounded"
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                >
                  <option value="receiving">Receiving (Stock In)</option>
                  <option value="issue">Issue (Stock Out)</option>
                  <option value="return">Return</option>
                  <option value="transfer">Transfer</option>
                  <option value="adjustment">Stock Adjustment</option>
                  <option value="count">Stock Count</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
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

export default InventoryManagementPage;
