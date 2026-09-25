"use strict";
// backend/src/services/workforceService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.workforceService = exports.WorkforceService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class WorkforceService {
    async getEmployees(farmId) {
        let query = supabaseAdmin_1.supabaseAdmin
            .from('farm_employees')
            .select('*, employee_certifications(*)')
            .order('full_name');
        if (farmId)
            query = query.eq('farm_id', farmId);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async addEmployee(payload) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('farm_employees')
            .insert([payload])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async addCertification(employeeId, certName, issuedDate, expiryDate, notes) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('employee_certifications')
            .insert([{ employee_id: employeeId, certification_name: certName, issued_date: issuedDate, expiry_date: expiryDate, notes }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
}
exports.WorkforceService = WorkforceService;
exports.workforceService = new WorkforceService();
//# sourceMappingURL=workforceService.js.map