"use strict";
// backend/src/controllers/feedRequestController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedRequestController = void 0;
const feedRequestService_1 = require("../services/feedRequestService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
/**
 * Controller for feed request lifecycle.
 */
exports.feedRequestController = {
    async create(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'feed:request:create');
            const request = await feedRequestService_1.feedRequestService.createRequest(req.body);
            res.status(201).json(request);
        }
        catch (err) {
            console.error('Error creating feed request', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async submit(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'feed:request:submit');
            const { id } = req.params;
            const result = await feedRequestService_1.feedRequestService.submitRequest(id, req.user?.id);
            res.json(result);
        }
        catch (err) {
            console.error('Error submitting feed request', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async approve(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'feed:request:approve');
            const { id } = req.params;
            const result = await feedRequestService_1.feedRequestService.approveRequest(id, req.user?.id);
            res.json(result);
        }
        catch (err) {
            console.error('Error approving feed request', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async reject(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'feed:request:approve');
            const { id } = req.params;
            const { rejectionReason } = req.body;
            const result = await feedRequestService_1.feedRequestService.rejectRequest(id, req.user?.id, rejectionReason);
            res.json(result);
        }
        catch (err) {
            console.error('Error rejecting feed request', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async list(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'feed:view');
            const filter = req.query;
            const requests = await feedRequestService_1.feedRequestService.listRequests(filter);
            res.json(requests);
        }
        catch (err) {
            console.error('Error listing feed requests', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=feedRequestController.js.map