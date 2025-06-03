const ticketRepository = require('../repositories/TicketRepository');
const { v4: uuidv4 } = require('uuid');

class TicketController {
    async getAllTickets(req, res) {
        try {
            const tickets = await ticketRepository.findAll();
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticket = await ticketRepository.findById(req.params.id);
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTicketsByContactId(req, res) {
        try {
            const tickets = await ticketRepository.findByContactId(req.params.contactId);
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createTicket(req, res) {
        try {
            const ticketData = {
                ...req.body,
                id: uuidv4()
            };
            const ticket = await ticketRepository.create(ticketData);
            res.status(201).json(ticket);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateTicket(req, res) {
        try {
            const ticket = await ticketRepository.update(req.params.id, req.body);
            res.json(ticket);
        } catch (error) {
            if (error.message === 'Ticket not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async deleteTicket(req, res) {
        try {
            await ticketRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Ticket not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TicketController(); 