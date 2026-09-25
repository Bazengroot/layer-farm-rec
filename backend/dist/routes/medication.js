"use strict";
// backend/src/routes/medication.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicationRouter = void 0;
const express_1 = require("express");
const medicationController_1 = require("../controllers/medicationController");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    await medicationController_1.medicationController.list(req, res);
});
router.post('/', async (req, res) => {
    await medicationController_1.medicationController.create(req, res);
});
router.put('/:id', async (req, res) => {
    await medicationController_1.medicationController.update(req, res);
});
router.delete('/:id', async (req, res) => {
    await medicationController_1.medicationController.delete(req, res);
});
exports.medicationRouter = router;
//# sourceMappingURL=medication.js.map