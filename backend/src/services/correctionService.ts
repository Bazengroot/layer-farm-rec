// backend/src/services/correctionService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { auditService } from './auditService';

export interface RequestCorrectionPayload {
  record_type: string;
  record_id: string;
  original_data: any;
  proposed_data: any;
  reason: string;
  requested_by: string;
}

export class CorrectionService {
  public async requestCorrection(payload: RequestCorrectionPayload) {
    const { data, error } = await supabaseAdmin
      .from('record_corrections')
      .insert([{
        record_type: payload.record_type,
        record_id: payload.record_id,
        original_data: payload.original_data,
        proposed_data: payload.proposed_data,
        reason: payload.reason,
        requested_by: payload.requested_by,
        status: 'Pending',
      }])
      .select()
      .single();

    if (error) throw error;

    await auditService.log({
      action_type: 'CORRECTION_REQUEST',
      entity_type: payload.record_type,
      entity_id: payload.record_id,
      user_id: payload.requested_by,
      changes_json: { reason: payload.reason, proposed_data: payload.proposed_data },
    });

    return data;
  }

  public async reviewCorrection(correctionId: string, reviewerId: string, approved: boolean) {
    const status = approved ? 'Approved' : 'Rejected';
    const { data: correction, error: fetchErr } = await supabaseAdmin
      .from('record_corrections')
      .select('*')
      .eq('id', correctionId)
      .single();

    if (fetchErr || !correction) throw new Error('Correction record not found');

    const { data: updated, error } = await supabaseAdmin
      .from('record_corrections')
      .update({
        status,
        approved_by: reviewerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', correctionId)
      .select()
      .single();

    if (error) throw error;

    await auditService.log({
      action_type: approved ? 'CORRECTION_APPROVED' : 'CORRECTION_REJECTED',
      entity_type: correction.record_type,
      entity_id: correction.record_id,
      user_id: reviewerId,
      changes_json: { status, original_data: correction.original_data, proposed_data: correction.proposed_data },
    });

    return updated;
  }

  public async getCorrectionHistory(recordType?: string, recordId?: string) {
    let query = supabaseAdmin.from('record_corrections').select('*').order('created_at', { ascending: false });
    if (recordType) query = query.eq('record_type', recordType);
    if (recordId) query = query.eq('record_id', recordId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

export const correctionService = new CorrectionService();
