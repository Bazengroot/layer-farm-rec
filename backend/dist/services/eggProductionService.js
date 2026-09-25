"use strict";
// backend/src/services/eggProductionService.ts
// Service for egg production records (CRUD, summaries)
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduction = createProduction;
exports.updateProduction = updateProduction;
exports.submitProduction = submitProduction;
exports.listProductions = listProductions;
exports.summarizeProduction = summarizeProduction;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/**
 * Create a new egg production record (Draft status)
 */
async function createProduction(data) {
    const { error, data: result } = await supabaseAdmin_1.supabaseAdmin
        .from('egg_production_records')
        .insert({
        ...data,
        id: (0, uuid_1.v4)(),
        status: 'Draft',
    })
        .select();
    if (error)
        throw error;
    return result?.[0];
}
/**
 * Update an existing draft record
 */
async function updateProduction(id, updates) {
    const { error, data } = await supabaseAdmin_1.supabaseAdmin
        .from('egg_production_records')
        .update({
        ...updates,
        updated_at: new Date().toISOString(),
    })
        .eq('id', id)
        .eq('status', 'Draft')
        .select();
    if (error)
        throw error;
    return data?.[0];
}
/**
 * Submit a draft for review (status -> Submitted)
 */
async function submitProduction(id) {
    const { error, data } = await supabaseAdmin_1.supabaseAdmin
        .from('egg_production_records')
        .update({ status: 'Submitted', updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('status', 'Draft')
        .select();
    if (error)
        throw error;
    return data?.[0];
}
/**
 * Get production records with optional filters
 */
async function listProductions(params) {
    let q = supabaseAdmin_1.supabaseAdmin.from('egg_production_records').select('*');
    if (params.farm_id)
        q = q.eq('farm_id', params.farm_id);
    if (params.flock_id)
        q = q.eq('flock_id', params.flock_id);
    if (params.start_date)
        q = q.gte('record_date', params.start_date);
    if (params.end_date)
        q = q.lte('record_date', params.end_date);
    const { error, data } = await q;
    if (error)
        throw error;
    return data;
}
/**
 * Summarize production by period (daily, weekly, monthly)
 */
async function summarizeProduction({ farm_id, period }) {
    // Simple example using SQL aggregation via RPC
    const sql = `
    SELECT DATE_TRUNC('${period}', record_date) AS period_start,
           SUM(total_eggs) AS total_eggs,
           SUM(saleable_eggs) AS saleable_eggs,
           AVG(average_weight) AS avg_weight
    FROM egg_production_records
    WHERE farm_id = '${farm_id}'
    GROUP BY period_start
    ORDER BY period_start DESC;
  `;
    const { error, data } = await supabaseAdmin_1.supabaseAdmin.rpc('raw_sql', { sql });
    if (error)
        throw error;
    return data;
}
exports.default = {
    createProduction,
    updateProduction,
    submitProduction,
    listProductions,
    summarizeProduction,
};
//# sourceMappingURL=eggProductionService.js.map