"use strict";
// backend/src/controllers/workflowController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.deleteEvidence = exports.getEvidence = exports.registerEvidence = exports.getCorrectionHistory = exports.reviewCorrection = exports.requestCorrection = exports.getPendingApprovals = exports.reviewApproval = exports.submitApproval = void 0;
const workflowService_1 = require("../services/workflowService");
const correctionService_1 = require("../services/correctionService");
const evidenceService_1 = require("../services/evidenceService");
const auditService_1 = require("../services/auditService");
// --- APPROVAL WORKFLOW ---
const submitApproval = async (req, res) => {
    try {
        const result = await workflowService_1.workflowService.submitApprovalRequest(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.submitApproval = submitApproval;
const reviewApproval = async (req, res) => {
    try {
        const result = await workflowService_1.workflowService.reviewApprovalRequest(req.body);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.reviewApproval = reviewApproval;
const getPendingApprovals = async (_req, res) => {
    try {
        const pending = await workflowService_1.workflowService.getPendingApprovals();
        return res.status(200).json(pending);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getPendingApprovals = getPendingApprovals;
// --- CORRECTION WORKFLOW ---
const requestCorrection = async (req, res) => {
    try {
        const result = await correctionService_1.correctionService.requestCorrection(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.requestCorrection = requestCorrection;
const reviewCorrection = async (req, res) => {
    try {
        const { correctionId, reviewerId, approved } = req.body;
        const result = await correctionService_1.correctionService.reviewCorrection(correctionId, reviewerId, approved);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.reviewCorrection = reviewCorrection;
const getCorrectionHistory = async (req, res) => {
    try {
        const { recordType, recordId } = req.query;
        const history = await correctionService_1.correctionService.getCorrectionHistory(recordType, recordId);
        return res.status(200).json(history);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getCorrectionHistory = getCorrectionHistory;
// --- EVIDENCE ATTACHMENTS ---
const registerEvidence = async (req, res) => {
    try {
        const result = await evidenceService_1.evidenceService.registerEvidence(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.registerEvidence = registerEvidence;
const getEvidence = async (req, res) => {
    try {
        const { entityType, entityId } = req.query;
        const items = await evidenceService_1.evidenceService.getEvidence(entityType, entityId);
        return res.status(200).json(items);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getEvidence = getEvidence;
const deleteEvidence = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const result = await evidenceService_1.evidenceService.deleteEvidence(id, userId);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.deleteEvidence = deleteEvidence;
// --- AUDIT LOGS ---
const getAuditLogs = async (req, res) => {
    try {
        const { entityType, limit } = req.query;
        const logs = await auditService_1.auditService.getLogs(entityType, limit ? parseInt(limit) : 50);
        return res.status(200).json(logs);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getAuditLogs = getAuditLogs;
//# sourceMappingURL=workflowController.js.map