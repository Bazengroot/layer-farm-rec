"use strict";
// backend/src/routes/feedMaster.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedMasterController_1 = require("../controllers/feedMasterController");
const router = (0, express_1.Router)();
// Units CRUD
router.post('/units', feedMasterController_1.feedMasterController.createUnit);
router.get('/units', feedMasterController_1.feedMasterController.listUnits);
router.put('/units/:id', feedMasterController_1.feedMasterController.updateUnit);
router.delete('/units/:id', feedMasterController_1.feedMasterController.deleteUnit);
// Types (only create example)
router.post('/types', feedMasterController_1.feedMasterController.createType);
exports.default = router;
//# sourceMappingURL=feedMaster.js.map