// backend/src/services/offlineSyncService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface SyncItemPayload {
  userId: string;
  clientTxId: string;
  entityType: string;
  payload: any;
}

export class OfflineSyncService {
  public async processSyncQueue(items: SyncItemPayload[]) {
    const results: any[] = [];

    for (const item of items) {
      // 1. Idempotency Check: check if clientTxId was already processed
      const { data: existing } = await supabaseAdmin
        .from('offline_sync_queue')
        .select('*')
        .eq('client_tx_id', item.clientTxId)
        .maybeSingle();

      if (existing) {
        results.push({
          clientTxId: item.clientTxId,
          status: existing.status,
          message: 'Already processed (idempotent)',
        });
        continue;
      }

      // 2. Insert into queue as Pending sync
      const { data: queueRow, error: queueErr } = await supabaseAdmin
        .from('offline_sync_queue')
        .insert([{
          user_id: item.userId,
          client_tx_id: item.clientTxId,
          entity_type: item.entityType,
          payload_json: item.payload,
          status: 'Pending sync',
        }])
        .select()
        .single();

      if (queueErr) {
        results.push({ clientTxId: item.clientTxId, status: 'Sync failed', error: queueErr.message });
        continue;
      }

      // 3. Process the actual entity insert / update based on entityType
      try {
        if (item.entityType === 'daily_health') {
          await supabaseAdmin.from('daily_health_records').insert([item.payload]);
        } else if (item.entityType === 'egg_production') {
          await supabaseAdmin.from('daily_egg_production').insert([item.payload]);
        } else if (item.entityType === 'feed_consumption') {
          await supabaseAdmin.from('daily_feed_consumption').insert([item.payload]);
        }

        // Update queue status to Synced
        await supabaseAdmin
          .from('offline_sync_queue')
          .update({ status: 'Synced', synced_at: new Date().toISOString() })
          .eq('id', queueRow.id);

        results.push({ clientTxId: item.clientTxId, status: 'Synced' });
      } catch (procErr: any) {
        await supabaseAdmin
          .from('offline_sync_queue')
          .update({ status: 'Sync failed', error_message: procErr.message })
          .eq('id', queueRow.id);

        results.push({ clientTxId: item.clientTxId, status: 'Sync failed', error: procErr.message });
      }
    }

    return results;
  }
}

export const offlineSyncService = new OfflineSyncService();
