// backend/src/services/medicationService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/** Service for CRUD on medication administration records */
export const medicationService = {
  async list(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('medication_administrations')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async create(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('medication_administrations').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  async update(id: string, payload: any) {
    const { error } = await supabaseAdmin
      .from('medication_administrations')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  },
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('medication_administrations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
