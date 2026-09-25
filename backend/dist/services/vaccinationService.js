"use strict";
// backend/src/services/vaccinationService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaccinationService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/** Service for CRUD on vaccination administration records */
exports.vaccinationService = {
    async list(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('vaccination_records')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async create(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('vaccination_records').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    async update(id, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin
            .from('vaccination_records')
            .update(payload)
            .eq('id', id);
        if (error)
            throw error;
    },
    async delete(id) {
        const { error } = await supabaseAdmin_1.supabaseAdmin
            .from('vaccination_records')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    },
};
//# sourceMappingURL=vaccinationService.js.map