// backend/src/services/healthMasterService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service layer for health‑module master data.
 * Provides basic CRUD operations for medication units, products, veterinarians,
 * vaccines, diseases, symptoms, treatment protocols, withdrawal overrides,
 * vaccine schedules and biosecurity checklist templates.
 */
export const healthMasterService = {
  // Medication Units
  async listMedicationUnits(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('medication_units')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createMedicationUnit(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('medication_units').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Medication Products
  async listMedicationProducts(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('medication_products')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createMedicationProduct(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('medication_products').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Veterinarians
  async listVeterinarians(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('veterinarians')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createVeterinarian(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('veterinarians').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Vaccines
  async listVaccines(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('vaccines')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createVaccine(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('vaccines').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Diseases
  async listDiseases(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('diseases')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createDisease(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('diseases').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Symptoms
  async listSymptoms(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('symptoms')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createSymptom(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('symptoms').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Treatment Protocols
  async listTreatmentProtocols(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('treatment_protocols')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createTreatmentProtocol(orgId: string, diseaseId: string, protocolJson: any) {
    const { error } = await supabaseAdmin.from('treatment_protocols').insert({
      id: uuidv4(),
      organization_id: orgId,
      disease_id: diseaseId,
      protocol_json: protocolJson,
    });
    if (error) throw error;
  },
  // Withdrawal Overrides
  async listWithdrawalOverrides(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('withdrawal_overrides')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createWithdrawalOverride(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('withdrawal_overrides').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Vaccine Schedules
  async listVaccineSchedules(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('vaccine_schedules')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createVaccineSchedule(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('vaccine_schedules').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
  // Biosecurity Checklists
  async listBiosecurityTemplates(orgId: string) {
    const { data, error } = await supabaseAdmin
      .from('biosecurity_checklist_templates')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },
  async createBiosecurityTemplate(orgId: string, payload: any) {
    const { error } = await supabaseAdmin.from('biosecurity_checklist_templates').insert({
      id: uuidv4(),
      organization_id: orgId,
      ...payload,
    });
    if (error) throw error;
  },
};
