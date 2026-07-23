import Ticket from '../models/ticketModel.js';

/**
 * POST /api/tickets
 * Create a new ticket (Normal User)
 */
export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const ticket = await Ticket.create({
      user: req.user.id,
      subject,
      message,
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/tickets/my-tickets
 * Get tickets for the logged-in user
 */
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/tickets
 * Get all tickets (Admin only)
 */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/tickets/:id/resolve
 * Resolve a ticket and add admin response (Admin only)
 */
export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;

    if (!adminResponse) {
      return res.status(400).json({ success: false, message: 'Admin response is required' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = 'Resolved';
    ticket.adminResponse = adminResponse;
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
