// backend/src/services/auditService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface AuditLogPayload {
  action_type: string;
  entity_type: string;
  entity_id?: string;
  user_id?: string;
  changes_json?: any;
  ip_address?: string;
}

export class AuditService {
  public async log(payload: AuditLogPayload) {
    try {
      await supabaseAdmin.from('audit_logs').insert([payload]);
    } catch (err) {
      console.error('Failed to record audit log entry:', err);
    }
  }

  public async getLogs(entityType?: string, limit = 50) {
    let query = supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (entityType) query = query.eq('entity_type', entityType);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

export const auditService = new AuditService();
