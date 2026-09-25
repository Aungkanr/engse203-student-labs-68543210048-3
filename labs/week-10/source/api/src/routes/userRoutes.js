import { Router } from 'express';
import { findAllUsers, findRequestsByUserId } from '../services/requestService.js';
import { asyncHandler, notFound } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const users = findAllUsers();
  res.json(users);
}));

router.get('/:id/requests', asyncHandler(async (req, res) => {
  const requests = findRequestsByUserId(req.params.id);
  res.json(requests);
}));

export default router;
