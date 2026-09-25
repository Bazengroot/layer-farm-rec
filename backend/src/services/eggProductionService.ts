// backend/src/services/eggProductionService.ts
// Service for egg production records (CRUD, summaries)

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new egg production record (Draft status)
 */
export async function createProduction(data: any) {
  const { error, data: result } = await supabaseAdmin
    .from('egg_production_records')
    .insert({
      ...data,
      id: uuidv4(),
      status: 'Draft',
    })
    .select();
  if (error) throw error;
  return result?.[0];
}

/**
 * Update an existing draft record
 */
export async function updateProduction(id: string, updates: any) {
  const { error, data } = await supabaseAdmin
    .from('egg_production_records')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'Draft')
    .select();
  if (error) throw error;
  return data?.[0];
}

/**
 * Submit a draft for review (status -> Submitted)
 */
export async function submitProduction(id: string) {
  const { error, data } = await supabaseAdmin
    .from('egg_production_records')
    .update({ status: 'Submitted', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'Draft')
    .select();
  if (error) throw error;
  return data?.[0];
}

/**
 * Get production records with optional filters
 */
export async function listProductions(params: any) {
  let q = supabaseAdmin.from('egg_production_records').select('*');
  if (params.farm_id) q = q.eq('farm_id', params.farm_id);
  if (params.flock_id) q = q.eq('flock_id', params.flock_id);
  if (params.start_date) q = q.gte('record_date', params.start_date);
  if (params.end_date) q = q.lte('record_date', params.end_date);
  const { error, data } = await q;
  if (error) throw error;
  return data;
}

/**
 * Summarize production by period (daily, weekly, monthly)
 */
export async function summarizeProduction({ farm_id, period }: { farm_id: string; period: 'daily' | 'weekly' | 'monthly' }) {
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
  const { error, data } = await supabaseAdmin.rpc('raw_sql', { sql });
  if (error) throw error;
  return data;
}

export default {
  createProduction,
  updateProduction,
  submitProduction,
  listProductions,
  summarizeProduction,
};
