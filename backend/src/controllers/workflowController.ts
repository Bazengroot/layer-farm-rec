// backend/src/controllers/workflowController.ts

import { Request, Response } from 'express';
import { workflowService } from '../services/workflowService';
import { correctionService } from '../services/correctionService';
import { evidenceService } from '../services/evidenceService';
import { auditService } from '../services/auditService';

// --- APPROVAL WORKFLOW ---
export const submitApproval = async (req: Request, res: Response) => {
  try {
    const result = await workflowService.submitApprovalRequest(req.body);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const reviewApproval = async (req: Request, res: Response) => {
  try {
    const result = await workflowService.reviewApprovalRequest(req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getPendingApprovals = async (_req: Request, res: Response) => {
  try {
    const pending = await workflowService.getPendingApprovals();
    return res.status(200).json(pending);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- CORRECTION WORKFLOW ---
export const requestCorrection = async (req: Request, res: Response) => {
  try {
    const result = await correctionService.requestCorrection(req.body);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const reviewCorrection = async (req: Request, res: Response) => {
  try {
    const { correctionId, reviewerId, approved } = req.body;
    const result = await correctionService.reviewCorrection(correctionId, reviewerId, approved);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getCorrectionHistory = async (req: Request, res: Response) => {
  try {
    const { recordType, recordId } = req.query as any;
    const history = await correctionService.getCorrectionHistory(recordType, recordId);
    return res.status(200).json(history);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- EVIDENCE ATTACHMENTS ---
export const registerEvidence = async (req: Request, res: Response) => {
  try {
    const result = await evidenceService.registerEvidence(req.body);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getEvidence = async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.query as any;
    const items = await evidenceService.getEvidence(entityType, entityId);
    return res.status(200).json(items);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const deleteEvidence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await evidenceService.deleteEvidence(id, userId);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- AUDIT LOGS ---
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { entityType, limit } = req.query as any;
    const logs = await auditService.getLogs(entityType, limit ? parseInt(limit) : 50);
    return res.status(200).json(logs);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
