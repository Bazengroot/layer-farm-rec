"use strict";
// backend/src/routes/eggDispatch.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eggDispatchController_1 = require("../controllers/eggDispatchController");
const router = (0, express_1.Router)();
router.post('/draft', eggDispatchController_1.eggDispatchController.createDraft); // create draft dispatch
router.post('/:dispatchId/approve', eggDispatchController_1.eggDispatchController.approve);
router.post('/:dispatchId/cancel', eggDispatchController_1.eggDispatchController.cancel);
router.get('/', eggDispatchController_1.eggDispatchController.list);
exports.default = router;
//# sourceMappingURL=eggDispatch.js.map