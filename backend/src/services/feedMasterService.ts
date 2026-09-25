// backend/src/services/feedMasterService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for Feed Master Data management.
 * Provides CRUD for feed units, types, suppliers, warehouses, bins, formulas, prices, and nutritional specifications.
 */
export const feedMasterService = {
  // ---------- Feed Units ----------
  async createUnit(params: { organizationId: string; code: string; description?: string }) {
    const { organizationId, code, description } = params;
    const { data, error } = await supabaseAdmin
      .from('feed_units')
      .insert({
        id: uuidv4(),
        organization_id: organizationId,
        code,
        description: description ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single();
    if (error) throw error;
    return data;
  },

  async listUnits(organizationId: string) {
    const { data, error } = await supabaseAdmin
      .from('feed_units')
      .select('*')
      .eq('organization_id', organizationId);
    if (error) throw error;
    return data;
  },

  async updateUnit(id: string, updates: { code?: string; description?: string; active?: boolean }) {
    const { error } = await supabaseAdmin
      .from('feed_units')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw error;
    return { id, updated: true };
  },

  async deleteUnit(id: string) {
    const { error } = await supabaseAdmin.from('feed_units').delete().eq('id', id);
    if (error) throw error;
    return { id, deleted: true };
  },

  // ---------- Feed Types ----------
  async createType(params: { organizationId: string; code: string; name: string; description?: string }) {
    const { organizationId, code, name, description } = params;
    const { data, error } = await supabaseAdmin
      .from('feed_types')
      .insert({
        id: uuidv4(),
        organization_id: organizationId,
        code,
        name,
        description: description ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single();
    if (error) throw error;
    return data;
  },

  // Additional CRUD methods for suppliers, warehouses, bins, formulas, prices, nutrition can be added similarly.
};
