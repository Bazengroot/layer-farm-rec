import { Router } from 'express';
import { getFlocks } from '../services/flockService';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

router.get('/', checkPermission('performance:view'), async (_req, res) => {
  try {
    const flocks = await getFlocks();
    res.json({ flocks });
  } catch (err) {
    console.error('Error fetching flocks', err);
    res.status(500).json({ error: 'Failed to fetch flocks' });
  }
});

export default router;
