// backend/src/services/vaccinationService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for CRUD on vaccination administration records */
export const vaccinationService = {
  async list(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('vaccination_records')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async create(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('vaccination_records').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  async update(id: string, payload: any) {
    const { error } = await supabaseAdmin
      .from('vaccination_records')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  },
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('vaccination_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
