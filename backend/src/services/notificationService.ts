// backend/src/services/notificationService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface NotificationPayload {
  user_id?: string;
  title: string;
  message: string;
  category: string;
  link?: string;
}

export class NotificationService {
  public async createNotification(payload: NotificationPayload) {
    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public async getUserNotifications(userId?: string) {
    let query = supabaseAdmin
      .from('user_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public async markAsRead(notificationId: string) {
    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public async evaluateFarmThresholds(farmId: string, dailyMortalityCount: number, _currentHdpPct: number) {
    const { data: threshold } = await supabaseAdmin
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

export const notificationService = new NotificationService();
