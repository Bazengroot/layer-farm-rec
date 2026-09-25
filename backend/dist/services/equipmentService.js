"use strict";
// backend/src/services/equipmentService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentService = exports.EquipmentService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class EquipmentService {
    async getEquipment() {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('farm_equipment')
            .select('*, equipment_maintenance_logs(*)')
            .order('name');
        if (error)
            throw error;
        return data;
    }
    async addEquipment(payload) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('farm_equipment')
            .insert([payload])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async logMaintenance(equipmentId, performedBy, description, cost, notes) {
        const { data: log, error } = await supabaseAdmin_1.supabaseAdmin
            .from('equipment_maintenance_logs')
            .insert([{ equipment_id: equipmentId, performed_by: performedBy, description, cost: cost || 0, notes }])
            .select()
            .single();
        if (error)
            throw error;
        // Update next_maintenance_date
        const { data: equip } = await supabaseAdmin_1.supabaseAdmin
            .from('farm_equipment')
            .select('maintenance_interval_days')
            .eq('id', equipmentId)
            .single();
        const interval = equip?.maintenance_interval_days || 30;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        await supabaseAdmin_1.supabaseAdmin
            .from('farm_equipment')
            .update({ next_maintenance_date: nextDate.toISOString().split('T')[0] })
            .eq('id', equipmentId);
        return log;
    }
}
exports.EquipmentService = EquipmentService;
exports.equipmentService = new EquipmentService();
//# sourceMappingURL=equipmentService.js.map