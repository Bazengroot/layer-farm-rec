// backend/src/services/eggInventoryService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for managing egg inventory transactions (in/out movements). */
export const eggInventoryService = {
  /** Record a new inventory transaction */
  async createTransaction(params: {
    organizationId: string;
    farmId: string;
    siteId: string;
    houseId: string;
    flockId: string;
    transactionDate: string; // YYYY-MM-DD
    type: 'IN' | 'OUT'; // IN = receiving, OUT = dispatch/usage
    quantity: number;
    storageLocationId?: string;
    notes?: string;
    recorderProfileId: string;
  }) {
    const { organizationId, farmId, siteId, houseId, flockId, transactionDate, type, quantity, storageLocationId, notes, recorderProfileId } = params;
    if (quantity <= 0) throw new Error('Quantity must be positive');
    const { data, error } = await supabaseAdmin
      .from('egg_inventory_transactions')
      .insert({
        id: uuidv4(),
        organization_id: organizationId,
        farm_id: farmId,
        site_id: siteId,
        house_id: houseId,
        flock_id: flockId,
        transaction_date: transactionDate,
        transaction_type: type,
        quantity,
        storage_location_id: storageLocationId,
        notes,
        recorder_profile_id: recorderProfileId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single();
    if (error) throw error;
    return data;
  },

  /** Get current stock balance per farm/house */
  async getBalance(filter: { farmId?: string; houseId?: string }) {
    let query = supabaseAdmin
      .from('egg_inventory_transactions')
      .select('quantity, transaction_type');
    if (filter.farmId) query = query.eq('farm_id', filter.farmId);
    if (filter.houseId) query = query.eq('house_id', filter.houseId);
    const { data, error } = await query;
    if (error) throw error;
    // Compute balance
    const balance = data.reduce((acc, rec: any) => {
      return acc + (rec.transaction_type === 'IN' ? rec.quantity : -rec.quantity);
    }, 0);
    return { balance };
  },
};
