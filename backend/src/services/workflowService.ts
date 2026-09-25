// backend/src/services/workflowService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { auditService } from './auditService';

export interface SubmitApprovalPayload {
  record_type: string;
  record_id: string;
  submitter_id: string;
  notes?: string;
}

export interface ReviewApprovalPayload {
  request_id: string;
  reviewer_id: string;
  action: 'Approved' | 'Rejected' | 'Correction Requested' | 'Cancelled';
  notes?: string;
}

export class WorkflowService {
  public async submitApprovalRequest(payload: SubmitApprovalPayload) {
    const { data: request, error } = await supabaseAdmin
      .from('approval_requests')
      .insert([{
        record_type: payload.record_type,
        record_id: payload.record_id,
        submitter_id: payload.submitter_id,
        status: 'Submitted',
        notes: payload.notes,
      }])
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin.from('approval_history').insert([{
      request_id: request.id,
      reviewer_id: payload.submitter_id,
      action: 'Submitted',
      notes: payload.notes,
    }]);

    await auditService.log({
      action_type: 'SUBMIT',
      entity_type: payload.record_type,
      entity_id: payload.record_id,
      user_id: payload.submitter_id,
      changes_json: { status: 'Submitted' },
    });

    return request;
  }

  public async reviewApprovalRequest(payload: ReviewApprovalPayload) {
    const { data: request, error: reqErr } = await supabaseAdmin
      .from('approval_requests')
      .select('*')
      .eq('id', payload.request_id)
      .single();

    if (reqErr || !request) throw new Error('Approval request not found');

    const { data: updatedReq, error: updateErr } = await supabaseAdmin
      .from('approval_requests')
      .update({
        status: payload.action,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payload.request_id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    await supabaseAdmin.from('approval_history').insert([{
      request_id: payload.request_id,
      reviewer_id: payload.reviewer_id,
      action: payload.action,
      notes: payload.notes,
    }]);

    await auditService.log({
      action_type: payload.action.toUpperCase().replace(/\s+/g, '_'),
      entity_type: request.record_type,
      entity_id: request.record_id,
      user_id: payload.reviewer_id,
      changes_json: { status: payload.action, notes: payload.notes },
    });

    return updatedReq;
  }

  public async getPendingApprovals() {
    const { data, error } = await supabaseAdmin
      .from('approval_requests')
      .select('*, approval_history(*)')
      .in('status', ['Submitted', 'Under Review', 'Correction Requested'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const workflowService = new WorkflowService();
