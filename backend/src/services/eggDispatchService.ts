// backend/src/services/eggDispatchService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for handling egg dispatches (draft, approve, cancel). */
export const eggDispatchService = {
  /** Create a new dispatch draft */
  async createDraft(params: {
    organizationId: string;
    farmId: string;
    siteId: string;
    houseId: string;
    flockId: string;
    dispatchDate: string; // YYYY-MM-DD
    quantity: number;
    storageLocationId: string;
    pricePerUnit: number; // in farm's currency
    currency: string; // e.g., 'IDR', 'USD'
    recorderProfileId: string;
    notes?: string;
  }) {
    const { organizationId, farmId, siteId, houseId, flockId, dispatchDate, quantity, storageLocationId, pricePerUnit, currency, recorderProfileId, notes } = params;
    if (quantity <= 0) throw new Error('Quantity must be positive');
    const { data, error } = await supabaseAdmin
      .from('egg_dispatches')
      .insert({
        id: uuidv4(),
        organization_id: organizationId,
        farm_id: farmId,
        site_id: siteId,
        house_id: houseId,
        flock_id: flockId,
        dispatch_date: dispatchDate,
        quantity,
        storage_location_id: storageLocationId,
        price_per_unit: pricePerUnit,
        currency,
        status: 'Draft',
        recorder_profile_id: recorderProfileId,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single();
    if (error) throw error;
    return data;
  },

  /** Approve a draft dispatch */
  async approve(dispatchId: string, approverProfileId: string) {
    const { data, error } = await supabaseAdmin
      .from('egg_dispatches')
      .update({
        status: 'Approved',
        approved_by_profile_id: approverProfileId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', dispatchId)
      .eq('status', 'Draft')
      .single();
    if (error) throw error;
    return data;
  },

  /** Cancel a draft or pending dispatch */
  async cancel(dispatchId: string, cancellerProfileId: string) {
    const { data, error } = await supabaseAdmin
      .from('egg_dispatches')
      .update({
        status: 'Cancelled',
        cancelled_by_profile_id: cancellerProfileId,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', dispatchId)
      .neq('status', 'Approved') // cannot cancel already approved
      .single();
    if (error) throw error;
    return data;
  },

  /** List dispatches with optional filters */
  async list(filter: { farmId?: string; status?: string; startDate?: string; endDate?: string }) {
    let q = supabaseAdmin.from('egg_dispatches').select('*');
    if (filter.farmId) q = q.eq('farm_id', filter.farmId);
    if (filter.status) q = q.eq('status', filter.status);
    if (filter.startDate) q = q.gte('dispatch_date', filter.startDate);
    if (filter.endDate) q = q.lte('dispatch_date', filter.endDate);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },
};
