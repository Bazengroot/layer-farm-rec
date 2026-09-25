import { Request, Response, NextFunction, Router } from 'express';
import { supabaseAdmin as supabase } from '../utils/supabaseAdmin';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/permissionMiddleware';

async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  return fn();
}

// Create a new draft daily record (status = Draft)
export async function createDraft(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      organization_id,
      farm_id,
      site_id,
      house_id,
      flock_id,
      record_date,
      shift_id,
    } = req.body;

    const { data, error } = await supabase.from('daily_flock_records').insert({
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

    if (error) throw error;
    res.status(201).json({ draft: data?.[0] });
  } catch (err) {
    next(err);
  }
}

// Save/update an existing draft
export async function saveDraft(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('daily_flock_records')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'Draft')
      .select();

    if (error) throw error;
    res.json({ draft: data?.[0] });
  } catch (err) {
    next(err);
  }
}

// Submit a draft for review (status -> Submitted)
export async function submitRecord(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('daily_flock_records')
      .update({ status: 'Submitted', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'Draft')
      .select();

    if (error) throw error;
    res.json({ record: data?.[0] });
  } catch (err) {
    next(err);
  }
}

// Approve or reject a submitted record
export async function reviewRecord(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { decision, comments } = req.body;
    await withTransaction(async () => {
      const { error: aprError } = await supabase.from('daily_record_approvals').insert({
        daily_flock_record_id: id,
        approver_profile_id: req.user?.uid,
        decision,
        comments,
      });
      if (aprError) throw aprError;

      const { error: updError } = await supabase
        .from('daily_flock_records')
        .update({ status: decision, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (updError) throw updError;
    });
    res.json({ message: 'Review processed' });
  } catch (err) {
    next(err);
  }
}

// Request a correction
export async function requestCorrection(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { error } = await supabase.from('recording_corrections').insert({
      daily_flock_record_id: id,
      corrected_by_profile_id: req.user?.uid,
      reason,
    });
    if (error) throw error;

    await supabase.from('daily_flock_records').update({ status: 'Draft' }).eq('id', id);
    res.json({ message: 'Correction requested' });
  } catch (err) {
    next(err);
  }
}

// Get historical records for a flock
export async function getHistorical(req: Request, res: Response, next: NextFunction) {
  try {
    const { flock_id } = req.params;
    const { start_date, end_date } = req.query;
    let query = supabase
      .from('daily_flock_records')
      .select('*')
      .eq('flock_id', flock_id)
      .order('record_date', { ascending: false });

    if (start_date) query = query.gte('record_date', start_date as string);
    if (end_date) query = query.lte('record_date', end_date as string);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ records: data });
  } catch (err) {
    next(err);
  }
}

// Router configuration
const router = Router();
router.post('/draft', authMiddleware, checkPermission('create_recording'), createDraft);
router.put('/draft/:id', authMiddleware, checkPermission('edit_recording'), saveDraft);
router.post('/submit/:id', authMiddleware, checkPermission('edit_recording'), submitRecord);
router.post('/review/:id', authMiddleware, checkPermission('approve_recording'), reviewRecord);
router.post('/correction/:id', authMiddleware, checkPermission('edit_recording'), requestCorrection);
router.get('/history/:flock_id', authMiddleware, checkPermission('view_farm'), getHistorical);

export default router;
