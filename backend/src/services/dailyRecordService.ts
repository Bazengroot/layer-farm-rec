// src/services/dailyRecordService.ts
// Service layer for daily recording engine
// Provides functions to create, update drafts, submit, approve, reject, and record corrections.

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

// Types (simplified). In a full implementation you would import generated types or define interfaces.
interface DailyFlockRecord {
  id?: string;
  organization_id: string;
  farm_id: string;
  site_id: string;
  house_id: string;
  flock_id: string;
  record_date: string; // YYYY-MM-DD
  shift_id?: string | null;
  recorder_profile_id: string;
  status?: string;
}

/**
 * Create a new daily record in Draft status.
 * The caller must ensure foreign‑key ids are valid.
 */
export async function createDraft(record: DailyFlockRecord) {
  const { data, error } = await supabaseAdmin
    .from('daily_flock_records')
    .insert({
      ...record,
      status: 'Draft',
      id: uuidv4(),
    })
    .select();
  if (error) throw error;
  return data[0];
}

/**
 * Update an existing draft. Only allowed while status is Draft.
 */
export async function updateDraft(id: string, updates: Partial<DailyFlockRecord>) {
  const { data, error } = await supabaseAdmin
    .from('daily_flock_records')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'Draft')
    .select();
  if (error) throw error;
  return data[0];
}

/**
 * Submit a draft. Calls the server‑side PostgreSQL function `submit_daily_record`
 * which validates business rules in a transaction and flips the status to Submitted.
 */
export async function submitRecord(id: string, recorderId: string) {
  const { error } = await supabaseAdmin.rpc('submit_daily_record', {
    p_record_id: id,
    p_recorder_id: recorderId,
  });
  if (error) throw error;
  // RPC returns boolean; we can fetch the updated record for convenience.
  const { data: rec, error: recErr } = await supabaseAdmin
    .from('daily_flock_records')
    .select('*')
    .eq('id', id);
  if (recErr) throw recErr;
  return rec[0];
}

/**
 * Approve a submitted record.
 */
export async function approveRecord(id: string, approverProfileId: string) {
  const { error } = await supabaseAdmin
    .from('daily_record_approvals')
    .insert({
      daily_flock_record_id: id,
      approver_profile_id: approverProfileId,
      decision: 'Approved',
    });
  if (error) throw error;
  // Update status
  const { error: updErr } = await supabaseAdmin
    .from('daily_flock_records')
    .update({ status: 'Approved', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (updErr) throw updErr;
  return true;
}

/**
 * Reject a submitted record.
 */
export async function rejectRecord(id: string, approverProfileId: string, comments?: string) {
  const { error } = await supabaseAdmin
    .from('daily_record_approvals')
    .insert({
      daily_flock_record_id: id,
      approver_profile_id: approverProfileId,
      decision: 'Rejected',
      comments: comments ?? null,
    });
  if (error) throw error;
  const { error: updErr } = await supabaseAdmin
    .from('daily_flock_records')
    .update({ status: 'Rejected', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (updErr) throw updErr;
  return true;
}

/**
 * Request correction on a record (e.g., after rejection).
 */
export async function requestCorrection(id: string, profileId: string, reason: string) {
  const { error } = await supabaseAdmin
    .from('recording_corrections')
    .insert({
      daily_flock_record_id: id,
      corrected_by_profile_id: profileId,
      reason,
    });
  if (error) throw error;
  // Set status to 'Correction Requested'
  const { error: updErr } = await supabaseAdmin
    .from('daily_flock_records')
    .update({ status: 'Correction Requested', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (updErr) throw updErr;
  return true;
}

/**
 * Fetch a daily record with its related details for display.
 */
export async function getFullRecord(id: string) {
  // Simplified: fetch core record and a few child tables.
  const [{ data: core, error: coreErr }, { data: pop, error: popErr }] = await Promise.all([
    supabaseAdmin.from('daily_flock_records').select('*').eq('id', id).single(),
    supabaseAdmin.from('daily_population_records').select('*').eq('daily_flock_record_id', id).single(),
  ]);
  if (coreErr) throw coreErr;
  if (popErr) throw popErr;
  return { ...core, population: pop };
}

/**
 * List records for a flock within a date range.
 */
export async function listRecords(params: {
  flock_id: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}) {
  let query = supabaseAdmin
    .from('daily_flock_records')
    .select('*')
    .eq('flock_id', params.flock_id);
  if (params.start_date) query = query.gte('record_date', params.start_date);
  if (params.end_date) query = query.lte('record_date', params.end_date);
  if (params.status) query = query.eq('status', params.status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export default {
  createDraft,
  updateDraft,
  submitRecord,
  approveRecord,
  rejectRecord,
  requestCorrection,
  getFullRecord,
  listRecords,
};
