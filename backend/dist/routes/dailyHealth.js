"use strict";
// backend/src/routes/dailyHealth.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyHealthRouter = void 0;
const express_1 = require("express");
const dailyHealthController_1 = require("../controllers/dailyHealthController");
const router = (0, express_1.Router)();
// List daily health records
router.get('/', async (req, res) => {
    await dailyHealthController_1.dailyHealthController.list(req, res);
});
// Create new record
router.post('/', async (req, res) => {
    await dailyHealthController_1.dailyHealthController.create(req, res);
});
// Update record
router.put('/:id', async (req, res) => {
    await dailyHealthController_1.dailyHealthController.update(req, res);
});
// Delete record
router.delete('/:id', async (req, res) => {
    await dailyHealthController_1.dailyHealthController.delete(req, res);
});
exports.dailyHealthRouter = router;
//# sourceMappingURL=dailyHealth.js.map