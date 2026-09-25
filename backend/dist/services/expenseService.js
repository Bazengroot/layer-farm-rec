"use strict";
// backend/src/services/expenseService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseService = exports.ExpenseService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class ExpenseService {
    async getExpenses(farmId) {
        let query = supabaseAdmin_1.supabaseAdmin
            .from('farm_expenses')
            .select('*, cost_allocations(*)')
            .order('expense_date', { ascending: false });
        if (farmId)
            query = query.eq('farm_id', farmId);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async recordExpense(payload) {
        const { allocations, ...expenseData } = payload;
        const { data: expense, error } = await supabaseAdmin_1.supabaseAdmin
            .from('farm_expenses')
            .insert([expenseData])
            .select()
            .single();
        if (error)
            throw error;
        if (allocations && allocations.length > 0) {
            const allocationRows = allocations.map((a) => ({
                expense_id: expense.id,
                allocation_target_type: a.allocation_target_type,
                target_id: a.target_id,
                allocation_percentage: a.allocation_percentage,
                allocated_amount: (expense.amount * a.allocation_percentage) / 100,
            }));
            await supabaseAdmin_1.supabaseAdmin.from('cost_allocations').insert(allocationRows);
        }
        return expense;
    }
}
exports.ExpenseService = ExpenseService;
exports.expenseService = new ExpenseService();
//# sourceMappingURL=expenseService.js.map