"use strict";
// backend/src/services/notificationService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class NotificationService {
    async createNotification(payload) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('user_notifications')
            .insert([payload])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserNotifications(userId) {
        let query = supabaseAdmin_1.supabaseAdmin
            .from('user_notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        if (userId)
            query = query.eq('user_id', userId);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async markAsRead(notificationId) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('user_notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async evaluateFarmThresholds(farmId, dailyMortalityCount, _currentHdpPct) {
        const { data: threshold } = await supabaseAdmin_1.supabaseAdmin
            .from('farm_notification_thresholds')
            .select('*')
            .eq('farm_id', farmId)
            .maybeSingle();
        const maxMortality = threshold?.abnormal_mortality_daily_count || 5;
        if (dailyMortalityCount > maxMortality) {
            await this.createNotification({
                title: 'Abnormal Mortality Alert',
                message: `Daily mortality count of ${dailyMortalityCount} exceeded threshold of ${maxMortality}.`,
                category: 'abnormal_mortality',
            });
        }
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notificationService.js.map