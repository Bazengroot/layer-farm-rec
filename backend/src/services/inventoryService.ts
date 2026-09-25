// backend/src/services/inventoryService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface InventoryItemPayload {
  category_id?: string;
  item_code: string;
  name: string;
  unit_of_measure: string;
  current_stock?: number;
  min_stock_threshold?: number;
  farm_id?: string;
  warehouse_id?: string;
}

export interface InventoryTransactionPayload {
  item_id: string;
  batch_id?: string;
  transaction_type: 'receiving' | 'issue' | 'return' | 'transfer' | 'adjustment' | 'count';
  quantity: number;
  unit_cost?: number;
  notes?: string;
}

export class InventoryService {
  public async getInventoryItems(farmId?: string) {
    let query = supabaseAdmin
      .from('inventory_items')
      .select('*, category:inventory_categories(name)')
      .order('name');
    if (farmId) query = query.eq('farm_id', farmId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public async createInventoryItem(payload: InventoryItemPayload) {
    const { data, error } = await supabaseAdmin
      .from('inventory_items')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  public async recordTransaction(payload: InventoryTransactionPayload) {
    const total_cost = (payload.quantity || 0) * (payload.unit_cost || 0);
    const { data: tx, error: txError } = await supabaseAdmin
      .from('inventory_transactions')
      .insert([{ ...payload, total_cost }])
      .select()
      .single();

    if (txError) throw txError;

    // Update stock in inventory_items
    const { data: item } = await supabaseAdmin
      .from('inventory_items')
      .select('current_stock')
      .eq('id', payload.item_id)
      .single();

    let stockDelta = payload.quantity;
    if (['issue', 'transfer'].includes(payload.transaction_type)) {
      stockDelta = -payload.quantity;
    }

    const newStock = Math.max(0, (item?.current_stock || 0) + stockDelta);
    await supabaseAdmin
      .from('inventory_items')
      .update({ current_stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', payload.item_id);

    return tx;
  }
}

export const inventoryService = new InventoryService();
