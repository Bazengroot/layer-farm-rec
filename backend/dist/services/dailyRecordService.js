"use strict";
// src/services/dailyRecordService.ts
// Service layer for daily recording engine
// Provides functions to create, update drafts, submit, approve, reject, and record corrections.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDraft = createDraft;
exports.updateDraft = updateDraft;
exports.submitRecord = submitRecord;
exports.approveRecord = approveRecord;
exports.rejectRecord = rejectRecord;
exports.requestCorrection = requestCorrection;
exports.getFullRecord = getFullRecord;
exports.listRecords = listRecords;
const supabaseAdmin_1 = __importDefault(require("../utils/supabaseAdmin"));
const uuid_1 = require("uuid");
/**
 * Create a new daily record in Draft status.
 * The caller must ensure foreign‑key ids are valid.
 */
async function createDraft(record) {
    const { data, error } = await supabaseAdmin_1.default
        .from('daily_flock_records')
        .insert({
        ...record,
        status: 'Draft',
        id: (0, uuid_1.v4)(),
    })
        .select();
    if (error)
        throw error;
    return data[0];
}
/**
 * Update an existing draft. Only allowed while status is Draft.
 */
async function updateDraft(id, updates) {
    const { data, error } = await supabaseAdmin_1.default
        .from('daily_flock_records')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('status', 'Draft')
        .select();
    if (error)
        throw error;
    return data[0];
}
/**
 * Submit a draft. Calls the server‑side PostgreSQL function `submit_daily_record`
 * which validates business rules in a transaction and flips the status to Submitted.
 */
async function submitRecord(id, recorderId) {
    const { data, error } = await supabaseAdmin_1.default.rpc('submit_daily_record', {
        p_record_id: id,
        p_recorder_id: recorderId,
    });
    if (error)
        throw error;
    // RPC returns boolean; we can fetch the updated record for convenience.
    const { data: rec, error: recErr } = await supabaseAdmin_1.default
        .from('daily_flock_records')
        .select('*')
        .eq('id', id);
    if (recErr)
        throw recErr;
    return rec[0];
}
/**
 * Approve a submitted record.
 */
async function approveRecord(id, approverProfileId) {
    const { error } = await supabaseAdmin_1.default
        .from('daily_record_approvals')
        .insert({
        daily_flock_record_id: id,
        approver_profile_id: approverProfileId,
        decision: 'Approved',
    });
    if (error)
        throw error;
    // Update status
    const { error: updErr } = await supabaseAdmin_1.default
        .from('daily_flock_records')
        .update({ status: 'Approved', updated_at: new Date().toISOString() })
        .eq('id', id);
    if (updErr)
        throw updErr;
    return true;
}
/**
 * Reject a submitted record.
 */
async function rejectRecord(id, approverProfileId, comments) {
    const { error } = await supabaseAdmin_1.default
        .from('daily_record_approvals')
        .insert({
        daily_flock_record_id: id,
        approver_profile_id: approverProfileId,
        decision: 'Rejected',
        comments: comments ?? null,
    });
    if (error)
        throw error;
    const { error: updErr } = await supabaseAdmin_1.default
        .from('daily_flock_records')
        .update({ status: 'Rejected', updated_at: new Date().toISOString() })
        .eq('id', id);
    if (updErr)
        throw updErr;
    return true;
}
/**
 * Request correction on a record (e.g., after rejection).
 */
async function requestCorrection(id, profileId, reason) {
    const { error } = await supabaseAdmin_1.default
        .from('recording_corrections')
        .insert({
        daily_flock_record_id: id,
        corrected_by_profile_id: profileId,
        reason,
    });
    if (error)
        throw error;
    // Set status to 'Correction Requested'
    const { error: updErr } = await supabaseAdmin_1.default
        .from('daily_flock_records')
        .update({ status: 'Correction Requested', updated_at: new Date().toISOString() })
        .eq('id', id);
    if (updErr)
        throw updErr;
    return true;
}
/**
 * Fetch a daily record with its related details for display.
 */
async function getFullRecord(id) {
    // Simplified: fetch core record and a few child tables.
    const [{ data: core, error: coreErr }, { data: pop, error: popErr }] = await Promise.all([
        supabaseAdmin_1.default.from('daily_flock_records').select('*').eq('id', id).single(),
        supabaseAdmin_1.default.from('daily_population_records').select('*').eq('daily_flock_record_id', id).single(),
    ]);
    if (coreErr)
        throw coreErr;
    if (popErr)
        throw popErr;
    return { ...core, population: pop };
}
/**
 * List records for a flock within a date range.
 */
async function listRecords(params) {
    let query = supabaseAdmin_1.default
        .from('daily_flock_records')
        .select('*')
        .eq('flock_id', params.flock_id);
    if (params.start_date)
        query = query.gte('record_date', params.start_date);
    if (params.end_date)
        query = query.lte('record_date', params.end_date);
    if (params.status)
        query = query.eq('status', params.status);
    const { data, error } = await query;
    if (error)
        throw error;
    return data;
}
exports.default = {
    createDraft,
    updateDraft,
    submitRecord,
    approveRecord,
    rejectRecord,
    requestCorrection,
    getFullRecord,
    listRecords,
};
//# sourceMappingURL=dailyRecordService.js.map