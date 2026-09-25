// backend/src/services/biosecurityService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for CRUD on biosecurity checklist records */
export const biosecurityService = {
  /** List all biosecurity checklist records for an organization */
  async list(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('biosecurity_checklist_records')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },

  /** Create a new biosecurity checklist record */
  async create(orgId: string, payload: any) {
    const { error } = await supabaseAdmin
      .from('biosecurity_checklist_records')
      .insert({
        id: uuidv4(),
        organization_id: orgId,
        ...payload,
      });
    if (error) throw error;
  },

  /** Update an existing biosecurity checklist record */
  async update(id: string, payload: any) {
    const { error } = await supabaseAdmin
      .from('biosecurity_checklist_records')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  },

  /** Delete a biosecurity checklist record */
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('biosecurity_checklist_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
