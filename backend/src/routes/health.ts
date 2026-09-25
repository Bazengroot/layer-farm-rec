import { Router, Request, Response } from 'express';
import { dailyHealthRouter } from '../routes/dailyHealth';
import { medicationRouter } from '../routes/medication';
import { vaccinationRouter } from '../routes/vaccination';

export const healthRouter = Router();

// Mount sub‑routers
healthRouter.use('/daily', dailyHealthRouter);
healthRouter.use('/medication', medicationRouter);
healthRouter.use('/vaccination', vaccinationRouter);
healthRouter.get('/', async (_req: Request, res: Response) => {
  const isDbConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

  return res.status(200).json({
    status: 'ok',
    service: 'lfrms-backend',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    database: {
      configured: isDbConfigured,
      provider: 'Supabase PostgreSQL',
    },
  });
});
