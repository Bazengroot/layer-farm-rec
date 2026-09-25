// backend/src/services/taskService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface OperationalTaskPayload {
  template_id?: string;
  title: string;
  category: string;
  location?: string;
  assigned_user_id?: string;
  due_date: string;
  priority?: string;
  status?: string;
  notes?: string;
  evidence_url?: string;
}

export class TaskService {
  public async getTasks(statusFilter?: string) {
    let query = supabaseAdmin.from('operational_tasks').select('*').order('due_date', { ascending: true });
    if (statusFilter) query = query.eq('status', statusFilter);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public async createTask(payload: OperationalTaskPayload) {
    const { data, error } = await supabaseAdmin
      .from('operational_tasks')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  public async updateTaskStatus(taskId: string, status: string, notes?: string, approvedBy?: string) {
    const updateData: any = { status };
    if (status === 'Completed' || status === 'Verified') {
      updateData.completion_time = new Date().toISOString();
    }
    if (notes) updateData.notes = notes;
    if (approvedBy) updateData.approved_by = approvedBy;

    const { data, error } = await supabaseAdmin
      .from('operational_tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const taskService = new TaskService();
