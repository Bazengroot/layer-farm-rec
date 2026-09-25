// backend/src/services/workforceService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface EmployeePayload {
  full_name: string;
  department: string;
  position: string;
  farm_id?: string;
  shift?: string;
  attendance_reference?: string;
  status?: string;
}

export class WorkforceService {
  public async getEmployees(farmId?: string) {
    let query = supabaseAdmin
      .from('farm_employees')
      .select('*, employee_certifications(*)')
      .order('full_name');
    if (farmId) query = query.eq('farm_id', farmId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public async addEmployee(payload: EmployeePayload) {
    const { data, error } = await supabaseAdmin
      .from('farm_employees')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  public async addCertification(employeeId: string, certName: string, issuedDate?: string, expiryDate?: string, notes?: string) {
    const { data, error } = await supabaseAdmin
      .from('employee_certifications')
      .insert([{ employee_id: employeeId, certification_name: certName, issued_date: issuedDate, expiry_date: expiryDate, notes }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export const workforceService = new WorkforceService();
