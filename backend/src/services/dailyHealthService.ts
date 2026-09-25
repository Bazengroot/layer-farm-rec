// backend/src/services/dailyHealthService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for CRUD on daily health records */
export const dailyHealthService = {
  async list(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('daily_health_records')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async create(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('daily_health_records').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  async update(id: string, payload: any) {
    const { error } = await supabaseAdmin
      .from('daily_health_records')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  },
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('daily_health_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
