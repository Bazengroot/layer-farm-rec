"use strict";
// backend/src/services/eggQualityService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggQualityService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/** Service for managing egg quality records. */
exports.eggQualityService = {
    /** Create a new quality record */
    async create(params) {
        const { organizationId, farmId, siteId, houseId, flockId, recordDate, shiftId, recorderProfileId, parameters } = params;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('egg_quality_records')
            .insert({
            id: (0, uuid_1.v4)(),
            organization_id: organizationId,
            farm_id: farmId,
            site_id: siteId,
            house_id: houseId,
            flock_id: flockId,
            record_date: recordDate,
            shift_id: shiftId,
            recorder_profile_id: recorderProfileId,
            min_weight: parameters.minWeight,
            max_weight: parameters.maxWeight,
            shell_quality_score: parameters.shellQualityScore,
            notes: parameters.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .single();
        if (error)
            throw error;
        return data;
    },
    /** List quality records */
    async list(filter) {
        let query = supabaseAdmin_1.supabaseAdmin.from('egg_quality_records').select('*');
        if (filter.flockId)
            query = query.eq('flock_id', filter.flockId);
        if (filter.startDate)
            query = query.gte('record_date', filter.startDate);
        if (filter.endDate)
            query = query.lte('record_date', filter.endDate);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    },
};
//# sourceMappingURL=eggQualityService.js.map