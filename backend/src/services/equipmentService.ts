// backend/src/services/equipmentService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface EquipmentPayload {
  name: string;
  serial_number?: string;
  location?: string;
  purchase_date?: string;
  condition_status?: string;
  maintenance_interval_days?: number;
  warranty_expiry_date?: string;
  status?: string;
}

export class EquipmentService {
  public async getEquipment() {
    const { data, error } = await supabaseAdmin
      .from('farm_equipment')
      .select('*, equipment_maintenance_logs(*)')
      .order('name');
    if (error) throw error;
    return data;
  }

  public async addEquipment(payload: EquipmentPayload) {
    const { data, error } = await supabaseAdmin
      .from('farm_equipment')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  public async logMaintenance(equipmentId: string, performedBy: string, description: string, cost?: number, notes?: string) {
    const { data: log, error } = await supabaseAdmin
      .from('equipment_maintenance_logs')
      .insert([{ equipment_id: equipmentId, performed_by: performedBy, description, cost: cost || 0, notes }])
      .select()
      .single();

    if (error) throw error;

    // Update next_maintenance_date
    const { data: equip } = await supabaseAdmin
      .from('farm_equipment')
      .select('maintenance_interval_days')
      .eq('id', equipmentId)
      .single();

    const interval = equip?.maintenance_interval_days || 30;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    await supabaseAdmin
      .from('farm_equipment')
      .update({ next_maintenance_date: nextDate.toISOString().split('T')[0] })
      .eq('id', equipmentId);

    return log;
  }
}

export const equipmentService = new EquipmentService();
