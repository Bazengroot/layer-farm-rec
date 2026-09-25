// backend/src/services/expenseService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface ExpensePayload {
  organization_id?: string;
  farm_id?: string;
  site_id?: string;
  house_id?: string;
  flock_id?: string;
  expense_category: string;
  expense_date?: string;
  amount: number;
  currency?: string;
  vendor_name?: string;
  invoice_number?: string;
  payment_status?: string;
  cost_center?: string;
  notes?: string;
  allocations?: Array<{
    allocation_target_type: string;
    target_id?: string;
    allocation_percentage: number;
  }>;
}

export class ExpenseService {
  public async getExpenses(farmId?: string) {
    let query = supabaseAdmin
      .from('farm_expenses')
      .select('*, cost_allocations(*)')
      .order('expense_date', { ascending: false });
    if (farmId) query = query.eq('farm_id', farmId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public async recordExpense(payload: ExpensePayload) {
    const { allocations, ...expenseData } = payload;
    const { data: expense, error } = await supabaseAdmin
      .from('farm_expenses')
      .insert([expenseData])
      .select()
      .single();

    if (error) throw error;

    if (allocations && allocations.length > 0) {
      const allocationRows = allocations.map((a) => ({
        expense_id: expense.id,
        allocation_target_type: a.allocation_target_type,
        target_id: a.target_id,
        allocation_percentage: a.allocation_percentage,
        allocated_amount: (expense.amount * a.allocation_percentage) / 100,
      }));

      await supabaseAdmin.from('cost_allocations').insert(allocationRows);
    }

    return expense;
  }
}

export const expenseService = new ExpenseService();
