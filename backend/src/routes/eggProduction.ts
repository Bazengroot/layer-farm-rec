// backend/src/routes/eggProduction.ts

import { Router } from 'express';
import eggProductionService from '../services/eggProductionService';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

// Create draft production record
router.post('/production', async (req, res) => {
  try {
    await checkPermission(req, 'egg:record');
    const record = await eggProductionService.createProduction(req.body);
    res.status(201).json(record);
  } catch (err: any) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Update draft
router.put('/production/:id', async (req, res) => {
  try {
    await checkPermission(req, 'egg:record');
    const updated = await eggProductionService.updateProduction(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Submit draft for review
router.post('/production/:id/submit', async (req, res) => {
  try {
    await checkPermission(req, 'egg:record');
    const submitted = await eggProductionService.submitProduction(req.params.id);
    res.json(submitted);
  } catch (err: any) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// List production records
router.get('/production', async (req, res) => {
  try {
    await checkPermission(req, 'egg:view');
    const records = await eggProductionService.listProductions(req.query as any);
    res.json(records);
  } catch (err: any) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Summarize production
router.get('/production/summary', async (req, res) => {
  try {
    await checkPermission(req, 'egg:view');
    const { farm_id, period } = req.query as any;
    const summary = await eggProductionService.summarizeProduction({ farm_id, period });
    res.json(summary);
  } catch (err: any) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
