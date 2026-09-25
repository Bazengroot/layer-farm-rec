"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flockService_1 = require("../services/flockService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
router.get('/', (0, permissionMiddleware_1.checkPermission)('performance:view'), async (_req, res) => {
    try {
        const flocks = await (0, flockService_1.getFlocks)();
        res.json({ flocks });
    }
    catch (err) {
        console.error('Error fetching flocks', err);
        res.status(500).json({ error: 'Failed to fetch flocks' });
    }
});
exports.default = router;
//# sourceMappingURL=flock.js.map