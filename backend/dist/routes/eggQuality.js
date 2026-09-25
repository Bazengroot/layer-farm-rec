"use strict";
// backend/src/routes/eggQuality.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eggQualityController_1 = require("../controllers/eggQualityController");
const router = (0, express_1.Router)();
router.post('/', eggQualityController_1.eggQualityController.create);
router.get('/', eggQualityController_1.eggQualityController.list);
exports.default = router;
//# sourceMappingURL=eggQuality.js.map