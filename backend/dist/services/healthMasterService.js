"use strict";
// backend/src/services/healthMasterService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthMasterService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/**
 * Service layer for health‑module master data.
 * Provides basic CRUD operations for medication units, products, veterinarians,
 * vaccines, diseases, symptoms, treatment protocols, withdrawal overrides,
 * vaccine schedules and biosecurity checklist templates.
 */
exports.healthMasterService = {
    // Medication Units
    async listMedicationUnits(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('medication_units')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createMedicationUnit(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('medication_units').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Medication Products
    async listMedicationProducts(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('medication_products')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createMedicationProduct(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('medication_products').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Veterinarians
    async listVeterinarians(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('veterinarians')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createVeterinarian(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('veterinarians').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Vaccines
    async listVaccines(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('vaccines')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createVaccine(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('vaccines').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Diseases
    async listDiseases(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('diseases')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createDisease(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('diseases').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Symptoms
    async listSymptoms(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('symptoms')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createSymptom(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('symptoms').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Treatment Protocols
    async listTreatmentProtocols(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('treatment_protocols')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createTreatmentProtocol(orgId, diseaseId, protocolJson) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('treatment_protocols').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            disease_id: diseaseId,
            protocol_json: protocolJson,
        });
        if (error)
            throw error;
    },
    // Withdrawal Overrides
    async listWithdrawalOverrides(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('withdrawal_overrides')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createWithdrawalOverride(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('withdrawal_overrides').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Vaccine Schedules
    async listVaccineSchedules(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('vaccine_schedules')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createVaccineSchedule(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('vaccine_schedules').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
    // Biosecurity Checklists
    async listBiosecurityTemplates(orgId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('biosecurity_checklist_templates')
            .select('*')
            .eq('organization_id', orgId);
        if (error)
            throw error;
        return data;
    },
    async createBiosecurityTemplate(orgId, payload) {
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('biosecurity_checklist_templates').insert({
            id: (0, uuid_1.v4)(),
            organization_id: orgId,
            ...payload,
        });
        if (error)
            throw error;
    },
};
//# sourceMappingURL=healthMasterService.js.map