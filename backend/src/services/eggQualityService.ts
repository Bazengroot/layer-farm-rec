// backend/src/services/eggQualityService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for managing egg quality records. */
export const eggQualityService = {
  /** Create a new quality record */
  async create(params: {
    organizationId: string;
    farmId: string;
    siteId: string;
    houseId: string;
    flockId: string;
    recordDate: string; // YYYY-MM-DD
    shiftId?: string;
    recorderProfileId: string;
    parameters: {
      minWeight?: number;
      maxWeight?: number;
      shellQualityScore?: number; // 0-100
      notes?: string;
    };
  }) {
    const { organizationId, farmId, siteId, houseId, flockId, recordDate, shiftId, recorderProfileId, parameters } = params;
    const { data, error } = await supabaseAdmin
      .from('egg_quality_records')
      .insert({
        id: uuidv4(),
        organization_id: organizationId,
        farm_id: farmId,
        site_id: siteId,
        house_id: houseId,
        flock_id: flockId,
        record_date: recordDate,
        shift_id: shiftId,
        recorder_profile_id: recorderProfileId,
        min_weight: parameters.minWeight,
        max_weight: parameters.maxWeight,
        shell_quality_score: parameters.shellQualityScore,
        notes: parameters.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single();
    if (error) throw error;
    return data;
  },

  /** List quality records */
  async list(filter: { flockId?: string; startDate?: string; endDate?: string }) {
    let query = supabaseAdmin.from('egg_quality_records').select('*');
    if (filter.flockId) query = query.eq('flock_id', filter.flockId);
    if (filter.startDate) query = query.gte('record_date', filter.startDate);
    if (filter.endDate) query = query.lte('record_date', filter.endDate);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};
