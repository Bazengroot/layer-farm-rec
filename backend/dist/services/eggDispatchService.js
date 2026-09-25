"use strict";
// backend/src/services/eggDispatchService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggDispatchService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/** Service for handling egg dispatches (draft, approve, cancel). */
exports.eggDispatchService = {
    /** Create a new dispatch draft */
    async createDraft(params) {
        const { organizationId, farmId, siteId, houseId, flockId, dispatchDate, quantity, storageLocationId, pricePerUnit, currency, recorderProfileId, notes } = params;
        if (quantity <= 0)
            throw new Error('Quantity must be positive');
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('egg_dispatches')
            .insert({
            id: (0, uuid_1.v4)(),
            organization_id: organizationId,
            farm_id: farmId,
            site_id: siteId,
            house_id: houseId,
            flock_id: flockId,
            dispatch_date: dispatchDate,
            quantity,
            storage_location_id: storageLocationId,
            price_per_unit: pricePerUnit,
            currency,
            status: 'Draft',
            recorder_profile_id: recorderProfileId,
            notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .single();
        if (error)
            throw error;
        return data;
    },
    /** Approve a draft dispatch */
    async approve(dispatchId, approverProfileId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('egg_dispatches')
            .update({
            status: 'Approved',
            approved_by_profile_id: approverProfileId,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .eq('id', dispatchId)
            .eq('status', 'Draft')
            .single();
        if (error)
            throw error;
        return data;
    },
    /** Cancel a draft or pending dispatch */
    async cancel(dispatchId, cancellerProfileId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('egg_dispatches')
            .update({
            status: 'Cancelled',
            cancelled_by_profile_id: cancellerProfileId,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .eq('id', dispatchId)
            .neq('status', 'Approved') // cannot cancel already approved
            .single();
        if (error)
            throw error;
        return data;
    },
    /** List dispatches with optional filters */
    async list(filter) {
        let q = supabaseAdmin_1.supabaseAdmin.from('egg_dispatches').select('*');
        if (filter.farmId)
            q = q.eq('farm_id', filter.farmId);
        if (filter.status)
            q = q.eq('status', filter.status);
        if (filter.startDate)
            q = q.gte('dispatch_date', filter.startDate);
        if (filter.endDate)
            q = q.lte('dispatch_date', filter.endDate);
        const { data, error } = await q;
        if (error)
            throw error;
        return data;
    },
};
//# sourceMappingURL=eggDispatchService.js.map