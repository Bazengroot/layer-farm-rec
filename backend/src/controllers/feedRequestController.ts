// backend/src/controllers/feedRequestController.ts

import { Request, Response } from 'express';
import { feedRequestService } from '../services/feedRequestService';
import { checkPermission } from '../middleware/permissionMiddleware';

/**
 * Controller for feed request lifecycle.
 */
export const feedRequestController = {
  async create(req: Request, res: Response) {
    try {
      await checkPermission(req, 'feed:request:create');
      const request = await feedRequestService.createRequest(req.body);
      res.status(201).json(request);
    } catch (err: any) {
      console.error('Error creating feed request', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async submit(req: Request, res: Response) {
    try {
      await checkPermission(req, 'feed:request:submit');
      const { id } = req.params;
      const result = await feedRequestService.submitRequest(id, (req.user as any)?.id);
      res.json(result);
    } catch (err: any) {
      console.error('Error submitting feed request', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async approve(req: Request, res: Response) {
    try {
      await checkPermission(req, 'feed:request:approve');
      const { id } = req.params;
      const result = await feedRequestService.approveRequest(id, (req.user as any)?.id);
      res.json(result);
    } catch (err: any) {
      console.error('Error approving feed request', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async reject(req: Request, res: Response) {
    try {
      await checkPermission(req, 'feed:request:approve');
      const { id } = req.params;
      const { rejectionReason } = req.body;
      const result = await feedRequestService.rejectRequest(id, (req.user as any)?.id, rejectionReason);
      res.json(result);
    } catch (err: any) {
      console.error('Error rejecting feed request', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      await checkPermission(req, 'feed:view');
      const filter = req.query as any;
      const requests = await feedRequestService.listRequests(filter);
      res.json(requests);
    } catch (err: any) {
      console.error('Error listing feed requests', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
