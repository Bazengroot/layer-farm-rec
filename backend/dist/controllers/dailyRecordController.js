"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDraft = createDraft;
exports.saveDraft = saveDraft;
exports.submitRecord = submitRecord;
exports.reviewRecord = reviewRecord;
exports.requestCorrection = requestCorrection;
exports.getHistorical = getHistorical;
const express_1 = require("express");
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const authMiddleware_1 = require("../middleware/authMiddleware");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
async function withTransaction(fn) {
    return fn();
}
// Create a new draft daily record (status = Draft)
async function createDraft(req, res, next) {
    try {
        const { organization_id, farm_id, site_id, house_id, flock_id, record_date, shift_id, } = req.body;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin.from('daily_flock_records').insert({
            organization_id,
            farm_id,
            site_id,
            house_id,
            flock_id,
            record_date,
            shift_id,
            recorder_profile_id: req.user?.uid,
            status: 'Draft',
        }).select();
        if (error)
            throw error;
        res.status(201).json({ draft: data?.[0] });
    }
    catch (err) {
        next(err);
    }
}
// Save/update an existing draft
async function saveDraft(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('daily_flock_records')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('status', 'Draft')
            .select();
        if (error)
            throw error;
        res.json({ draft: data?.[0] });
    }
    catch (err) {
        next(err);
    }
}
// Submit a draft for review (status -> Submitted)
async function submitRecord(req, res, next) {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('daily_flock_records')
            .update({ status: 'Submitted', updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('status', 'Draft')
            .select();
        if (error)
            throw error;
        res.json({ record: data?.[0] });
    }
    catch (err) {
        next(err);
    }
}
// Approve or reject a submitted record
async function reviewRecord(req, res, next) {
    try {
        const { id } = req.params;
        const { decision, comments } = req.body;
        await withTransaction(async () => {
            const { error: aprError } = await supabaseAdmin_1.supabaseAdmin.from('daily_record_approvals').insert({
                daily_flock_record_id: id,
                approver_profile_id: req.user?.uid,
                decision,
                comments,
            });
            if (aprError)
                throw aprError;
            const { error: updError } = await supabaseAdmin_1.supabaseAdmin
                .from('daily_flock_records')
                .update({ status: decision, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (updError)
                throw updError;
        });
        res.json({ message: 'Review processed' });
    }
    catch (err) {
        next(err);
    }
}
// Request a correction
async function requestCorrection(req, res, next) {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const { error } = await supabaseAdmin_1.supabaseAdmin.from('recording_corrections').insert({
            daily_flock_record_id: id,
            corrected_by_profile_id: req.user?.uid,
            reason,
        });
        if (error)
            throw error;
        await supabaseAdmin_1.supabaseAdmin.from('daily_flock_records').update({ status: 'Draft' }).eq('id', id);
        res.json({ message: 'Correction requested' });
    }
    catch (err) {
        next(err);
    }
}
// Get historical records for a flock
async function getHistorical(req, res, next) {
    try {
        const { flock_id } = req.params;
        const { start_date, end_date } = req.query;
        let query = supabaseAdmin_1.supabaseAdmin
            .from('daily_flock_records')
            .select('*')
            .eq('flock_id', flock_id)
            .order('record_date', { ascending: false });
        if (start_date)
            query = query.gte('record_date', start_date);
        if (end_date)
            query = query.lte('record_date', end_date);
        const { data, error } = await query;
        if (error)
            throw error;
        res.json({ records: data });
    }
    catch (err) {
        next(err);
    }
}
// Router configuration
const router = (0, express_1.Router)();
router.post('/draft', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('create_recording'), createDraft);
router.put('/draft/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('edit_recording'), saveDraft);
router.post('/submit/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('edit_recording'), submitRecord);
router.post('/review/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('approve_recording'), reviewRecord);
router.post('/correction/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('edit_recording'), requestCorrection);
router.get('/history/:flock_id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('view_farm'), getHistorical);
exports.default = router;
//# sourceMappingURL=dailyRecordController.js.map