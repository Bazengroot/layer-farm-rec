"use strict";
// backend/src/routes/vaccination.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaccinationRouter = void 0;
const express_1 = require("express");
const vaccinationController_1 = require("../controllers/vaccinationController");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    await vaccinationController_1.vaccinationController.list(req, res);
});
router.post('/', async (req, res) => {
    await vaccinationController_1.vaccinationController.create(req, res);
});
router.put('/:id', async (req, res) => {
    await vaccinationController_1.vaccinationController.update(req, res);
});
router.delete('/:id', async (req, res) => {
    await vaccinationController_1.vaccinationController.delete(req, res);
});
exports.vaccinationRouter = router;
//# sourceMappingURL=vaccination.js.map