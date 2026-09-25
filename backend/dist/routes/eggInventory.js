"use strict";
// backend/src/routes/eggInventory.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eggInventoryController_1 = require("../controllers/eggInventoryController");
const router = (0, express_1.Router)();
router.post('/transaction', eggInventoryController_1.eggInventoryController.createTransaction);
router.get('/balance', eggInventoryController_1.eggInventoryController.getBalance);
exports.default = router;
//# sourceMappingURL=eggInventory.js.map