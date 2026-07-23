import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  resolveTicket,
} from '../controllers/ticketController.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(verifyToken, createTicket)
  .get(verifyToken, requireAdmin, getAllTickets);

router.get('/my-tickets', verifyToken, getMyTickets);

router.put('/:id/resolve', verifyToken, requireAdmin, resolveTicket);

export default router;
