import { Router } from 'express';
import { healthRouter } from './health';
import { performanceRouter } from './performance';
import authRouter from './auth';
import dailyRecordRouter from '../controllers/dailyRecordController';
import eggProductionRouter from './eggProduction';
import eggGradingRouter from './eggGrading';
import eggQualityRouter from './eggQuality';
import eggDispatchRouter from './eggDispatch';
import eggInventoryRouter from './eggInventory';
import feedMasterRouter from '../routes/feedMaster';
import feedRequestRouter from '../routes/feedRequest';
import flockRouter from './flock';
import { dashboardRouter } from './dashboard';
import { reportRouter } from './report';
import { operationsRouter } from './operations';
import { workflowRouter } from './workflow';
import { mobileRouter } from './mobile';

const router = Router();

// Mount sub-routers
router.use('/health', healthRouter);
router.use('/performance', performanceRouter);
router.use('/auth', authRouter);
router.use('/daily-records', dailyRecordRouter);
router.use('/egg', eggProductionRouter);
router.use('/egg', eggGradingRouter);
router.use('/egg', eggQualityRouter);
router.use('/egg', eggDispatchRouter);
router.use('/egg', eggInventoryRouter);
router.use('/feed', feedMasterRouter);
router.use('/feed', feedRequestRouter);
router.use('/flocks', flockRouter);
router.use('/dashboard', dashboardRouter);
router.use('/reports', reportRouter);
router.use('/operations', operationsRouter);
router.use('/workflow', workflowRouter);
router.use('/mobile', mobileRouter);

export default router;
