"use strict";
// backend/src/routes/eggGrading.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eggGradingController_1 = require("../controllers/eggGradingController");
const router = (0, express_1.Router)();
router.post('/batch', eggGradingController_1.eggGradingController.createBatch);
router.get('/batches', eggGradingController_1.eggGradingController.listBatches);
router.put('/batch/:batchId', eggGradingController_1.eggGradingController.updateBatch);
exports.default = router;
//# sourceMappingURL=eggGrading.js.map