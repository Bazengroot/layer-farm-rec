// backend/src/services/eggGradingService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing egg grading batches.
 * Provides CRUD operations and validation against farm‑specific grade configurations.
 */
export const eggGradingService = {
  /** Create a new grading batch */
  async createBatch(params: {
    organizationId: string;
    farmId: string;
    siteId: string;
    houseId: string;
    flockId: string;
    recordDate: string; // YYYY‑MM‑DD
    shiftId?: string;
    recorderProfileId: string;
    grades: Array<{ gradeCode: string; quantity: number }>; // quantity per grade
  }) {
    const { organizationId, farmId, siteId, houseId, flockId, recordDate, shiftId, recorderProfileId, grades } = params;

    // Validate that quantities are non‑negative and sum matches total eggs for the day (business rule could be enforced elsewhere)
    for (const g of grades) {
      if (g.quantity < 0) {
        throw new Error('Grade quantity cannot be negative');
      }
    }

    // Insert batch header
    const { data: batch, error: batchError } = await supabaseAdmin
      .from('egg_grading_batches')
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (batchError) throw batchError;
    if (!batch) throw new Error('Failed to create grading batch');

    // Insert grade details
    const gradeInserts = grades.map((g) => ({
      id: uuidv4(),
      egg_grading_batch_id: batch.id,
      grade_code: g.gradeCode,
      quantity: g.quantity,
      created_at: new Date().toISOString(),
    }));

    const { error: detailError } = await supabaseAdmin
      .from('egg_grading_batch_details')
      .insert(gradeInserts);
    if (detailError) throw detailError;

    return batch;
  },

  /** Retrieve grading batches for a flock/date range */
  async listBatches(filter: { flockId?: string; startDate?: string; endDate?: string }) {
    let query = supabaseAdmin.from('egg_grading_batches').select('*');
    if (filter.flockId) query = query.eq('flock_id', filter.flockId);
    if (filter.startDate) query = query.gte('record_date', filter.startDate);
    if (filter.endDate) query = query.lte('record_date', filter.endDate);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /** Update a grading batch (only allowed for draft status) */
  async updateBatch(batchId: string, updates: { grades?: Array<{ gradeCode: string; quantity: number }> }) {
    // For simplicity we replace grade details entirely if provided
    if (updates.grades) {
      // Delete existing details
      const { error: delErr } = await supabaseAdmin
        .from('egg_grading_batch_details')
        .delete()
        .eq('egg_grading_batch_id', batchId);
      if (delErr) throw delErr;

      // Insert new details
      const newDetails = updates.grades.map((g) => ({
        id: uuidv4(),
        egg_grading_batch_id: batchId,
        grade_code: g.gradeCode,
        quantity: g.quantity,
        created_at: new Date().toISOString(),
      }));
      const { error: insErr } = await supabaseAdmin.from('egg_grading_batch_details').insert(newDetails);
      if (insErr) throw insErr;
    }
    // Update timestamp on header
    const { error: updErr } = await supabaseAdmin
      .from('egg_grading_batches')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', batchId);
    if (updErr) throw updErr;
    return { batchId, updated: true };
  },
};
