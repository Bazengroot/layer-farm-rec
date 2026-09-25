// backend/src/services/feedRequestService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service handling feed request lifecycle.
 * Supports creation (draft), submission, approval/rejection.
 */
export const feedRequestService = {
  /** Create a new feed request in Draft status */
  async createRequest(params: {
    organizationId: string;
    farmId: string;
    siteId: string;
    houseId: string;
    flockId: string;
    feedTypeId: string;
    quantity: number;
    unitId: string;
    requiredDate: string; // YYYY-MM-DD
    requesterId: string;
    reason?: string;
  }) {
    const {
      organizationId,
      farmId,
      siteId,
      houseId,
      flockId,
      feedTypeId,
      quantity,
      unitId,
      requiredDate,
      requesterId,
      reason,
    } = params;
    const { data, error } = await supabaseAdmin
      .from('feed_requests')
      .insert({
        id: uuidv4(),
        organization_id: organizationId,
        farm_id: farmId,
        site_id: siteId,
        house_id: houseId,
        flock_id: flockId,
        feed_type_id: feedTypeId,
        quantity,
        unit_id: unitId,
        required_date: requiredDate,
        requester_id: requesterId,
        reason: reason ?? null,
        status: 'Draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .single();
    if (error) throw error;
    return data;
  },

  /** Submit a draft request for approval */
  async submitRequest(requestId: string, updaterId: string) {
    const { error } = await supabaseAdmin
      .from('feed_requests')
      .update({
        status: 'Submitted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('status', 'Draft');
    if (error) throw error;
    return { requestId, submitted: true };
  },

  /** Approve a submitted request */
  async approveRequest(requestId: string, approverId: string) {
    const { error } = await supabaseAdmin
      .from('feed_requests')
      .update({
        status: 'Approved',
        approval_id: approverId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('status', 'Submitted');
    if (error) throw error;
    return { requestId, approved: true };
  },

  /** Reject a submitted request with a reason */
  async rejectRequest(requestId: string, approverId: string, rejectionReason: string) {
    const { error } = await supabaseAdmin
      .from('feed_requests')
      .update({
        status: 'Rejected',
        approval_id: approverId,
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('status', 'Submitted');
    if (error) throw error;
    return { requestId, rejected: true };
  },

  /** List requests with optional filters */
  async listRequests(filter: {
    organizationId?: string;
    status?: string;
    farmId?: string;
    flockId?: string;
  }) {
    let query = supabaseAdmin.from('feed_requests').select('*');
    if (filter.organizationId) query = query.eq('organization_id', filter.organizationId);
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.farmId) query = query.eq('farm_id', filter.farmId);
    if (filter.flockId) query = query.eq('flock_id', filter.flockId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};
