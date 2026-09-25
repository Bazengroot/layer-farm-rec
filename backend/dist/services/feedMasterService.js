"use strict";
// backend/src/services/feedMasterService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedMasterService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/**
 * Service for Feed Master Data management.
 * Provides CRUD for feed units, types, suppliers, warehouses, bins, formulas, prices, and nutritional specifications.
 */
exports.feedMasterService = {
    // ---------- Feed Units ----------
    async createUnit(params) {
        const { organizationId, code, description } = params;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('feed_units')
            .insert({
            id: (0, uuid_1.v4)(),
            organization_id: organizationId,
            code,
            description: description ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .single();
        if (error)
            throw error;
        return data;
    },
    async listUnits(organizationId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('feed_units')
            .select('*')
            .eq('organization_id', organizationId);
        if (error)
            throw error;
        return data;
    },
    async updateUnit(id, updates) {
        const { error } = await supabaseAdmin_1.supabaseAdmin
            .from('feed_units')
            .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id);
        if (error)
            throw error;
        return { id, updated: true };
    },
    async deleteUnit(id) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('feed_units').delete().eq('id', id);
        if (error)
            throw error;
        return { id, deleted: true };
    },
    // ---------- Feed Types ----------
    async createType(params) {
        const { organizationId, code, name, description } = params;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('feed_types')
            .insert({
            id: (0, uuid_1.v4)(),
            organization_id: organizationId,
            code,
            name,
            description: description ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .single();
        if (error)
            throw error;
        return data;
    },
    // Additional CRUD methods for suppliers, warehouses, bins, formulas, prices, nutrition can be added similarly.
};
//# sourceMappingURL=feedMasterService.js.map