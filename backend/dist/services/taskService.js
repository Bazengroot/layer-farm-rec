"use strict";
// backend/src/services/taskService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
class TaskService {
    async getTasks(statusFilter) {
        let query = supabaseAdmin_1.supabaseAdmin.from('operational_tasks').select('*').order('due_date', { ascending: true });
        if (statusFilter)
            query = query.eq('status', statusFilter);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async createTask(payload) {
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('operational_tasks')
            .insert([payload])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async updateTaskStatus(taskId, status, notes, approvedBy) {
        const updateData = { status };
        if (status === 'Completed' || status === 'Verified') {
            updateData.completion_time = new Date().toISOString();
        }
        if (notes)
            updateData.notes = notes;
        if (approvedBy)
            updateData.approved_by = approvedBy;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('operational_tasks')
            .update(updateData)
            .eq('id', taskId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
//# sourceMappingURL=taskService.js.map