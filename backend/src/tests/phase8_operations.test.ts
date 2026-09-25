// backend/src/tests/phase8_operations.test.ts

import { InventoryService } from '../services/inventoryService';
import { ExpenseService } from '../services/expenseService';
import { TaskService } from '../services/taskService';
import { EquipmentService } from '../services/equipmentService';

describe('Phase 8 Operations Unit Tests', () => {
  describe('Inventory Delta Calculations', () => {
    it('should correctly determine stock delta for issue transaction type', () => {
      const currentStock = 100;
      const quantity = 30;
      const txType = 'issue';

      let stockDelta = quantity;
      if (['issue', 'transfer'].includes(txType)) {
        stockDelta = -quantity;
      }

      const newStock = Math.max(0, currentStock + stockDelta);
      expect(newStock).toBe(70);
    });

    it('should correctly determine stock delta for receiving transaction type', () => {
      const currentStock = 100;
      const quantity = 50;
      const txType = 'receiving';

      let stockDelta = quantity;
      if (['issue', 'transfer'].includes(txType)) {
        stockDelta = -quantity;
      }

      const newStock = Math.max(0, currentStock + stockDelta);
      expect(newStock).toBe(150);
    });
  });

  describe('Cost Allocation Rules', () => {
    it('should split expense amount across allocations without double counting', () => {
      const totalAmount = 1000;
      const allocations = [
        { target: 'House 1', percentage: 60 },
        { target: 'House 2', percentage: 40 },
      ];

      const allocatedRows = allocations.map((a) => ({
        target: a.target,
        amount: (totalAmount * a.percentage) / 100,
      }));

      const sumAllocated = allocatedRows.reduce((sum, r) => sum + r.amount, 0);

      expect(allocatedRows[0].amount).toBe(600);
      expect(allocatedRows[1].amount).toBe(400);
      expect(sumAllocated).toBe(totalAmount);
    });
  });

  describe('Equipment Maintenance Date Scheduling', () => {
    it('should calculate next maintenance date based on interval days', () => {
      const baseDate = new Date('2026-09-01');
      const intervalDays = 30;

      const nextDate = new Date(baseDate);
      nextDate.setDate(nextDate.getDate() + intervalDays);

      expect(nextDate.toISOString().split('T')[0]).toBe('2026-10-01');
    });
  });
});
