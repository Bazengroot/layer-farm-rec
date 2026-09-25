"use strict";
// backend/src/services/offlineSyncService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineSyncService = exports.OfflineSyncService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class OfflineSyncService {
    async processSyncQueue(items) {
        const results = [];
        for (const item of items) {
            // 1. Idempotency Check: check if clientTxId was already processed
            const { data: existing } = await supabaseAdmin_1.supabaseAdmin
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
            const { data: queueRow, error: queueErr } = await supabaseAdmin_1.supabaseAdmin
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
                    await supabaseAdmin_1.supabaseAdmin.from('daily_health_records').insert([item.payload]);
                }
                else if (item.entityType === 'egg_production') {
                    await supabaseAdmin_1.supabaseAdmin.from('daily_egg_production').insert([item.payload]);
                }
                else if (item.entityType === 'feed_consumption') {
                    await supabaseAdmin_1.supabaseAdmin.from('daily_feed_consumption').insert([item.payload]);
                }
                // Update queue status to Synced
                await supabaseAdmin_1.supabaseAdmin
                    .from('offline_sync_queue')
                    .update({ status: 'Synced', synced_at: new Date().toISOString() })
                    .eq('id', queueRow.id);
                results.push({ clientTxId: item.clientTxId, status: 'Synced' });
            }
            catch (procErr) {
                await supabaseAdmin_1.supabaseAdmin
                    .from('offline_sync_queue')
                    .update({ status: 'Sync failed', error_message: procErr.message })
                    .eq('id', queueRow.id);
                results.push({ clientTxId: item.clientTxId, status: 'Sync failed', error: procErr.message });
            }
        }
        return results;
    }
}
exports.OfflineSyncService = OfflineSyncService;
exports.offlineSyncService = new OfflineSyncService();
//# sourceMappingURL=offlineSyncService.js.map