const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/TicketController');

// Get all tickets
router.get('/', ticketController.getAllTickets);

// Get ticket by ID
router.get('/:id', ticketController.getTicketById);

// Get tickets by contact ID
router.get('/contact/:contactId', ticketController.getTicketsByContactId);

// Create new ticket
router.post('/', ticketController.createTicket);

// Update ticket
router.put('/:id', ticketController.updateTicket);

// Delete ticket
router.delete('/:id', ticketController.deleteTicket);

module.exports = router; 