"use strict";
// backend/src/services/inventoryService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class InventoryService {
    async getInventoryItems(farmId) {
        let query = supabaseAdmin_1.supabaseAdmin
            .from('inventory_items')
            .select('*, category:inventory_categories(name)')
            .order('name');
        if (farmId)
            query = query.eq('farm_id', farmId);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async createInventoryItem(payload) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('inventory_items')
            .insert([payload])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async recordTransaction(payload) {
        const total_cost = (payload.quantity || 0) * (payload.unit_cost || 0);
        const { data: tx, error: txError } = await supabaseAdmin_1.supabaseAdmin
            .from('inventory_transactions')
            .insert([{ ...payload, total_cost }])
            .select()
            .single();
        if (txError)
            throw txError;
        // Update stock in inventory_items
        const { data: item } = await supabaseAdmin_1.supabaseAdmin
            .from('inventory_items')
            .select('current_stock')
            .eq('id', payload.item_id)
            .single();
        let stockDelta = payload.quantity;
        if (['issue', 'transfer'].includes(payload.transaction_type)) {
            stockDelta = -payload.quantity;
        }
        const newStock = Math.max(0, (item?.current_stock || 0) + stockDelta);
        await supabaseAdmin_1.supabaseAdmin
            .from('inventory_items')
            .update({ current_stock: newStock, updated_at: new Date().toISOString() })
            .eq('id', payload.item_id);
        return tx;
    }
}
exports.InventoryService = InventoryService;
exports.inventoryService = new InventoryService();
//# sourceMappingURL=inventoryService.js.map