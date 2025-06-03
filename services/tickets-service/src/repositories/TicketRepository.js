const fs = require('fs').promises;
const path = require('path');
const Ticket = require('../models/Ticket');

class TicketRepository {
    constructor() {
        this.dataFile = path.join(__dirname, '../../data/tickets.json');
        this.tickets = new Map();
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
            const data = await fs.readFile(this.dataFile, 'utf8').catch(() => '[]');
            const tickets = JSON.parse(data);
            tickets.forEach(ticket => {
                this.tickets.set(ticket.id, new Ticket(ticket));
            });
        } catch (error) {
            console.error('Error initializing ticket repository:', error);
            throw error;
        }
    }

    async save() {
        try {
            const tickets = Array.from(this.tickets.values()).map(ticket => ticket.toJSON());
            await fs.writeFile(this.dataFile, JSON.stringify(tickets, null, 2));
        } catch (error) {
            console.error('Error saving tickets:', error);
            throw error;
        }
    }

    async findAll() {
        return Array.from(this.tickets.values());
    }

    async findById(id) {
        return this.tickets.get(id);
    }

    async findByContactId(contactId) {
        return Array.from(this.tickets.values())
            .filter(ticket => ticket.contactId === contactId);
    }

    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        ticket.validate();
        this.tickets.set(ticket.id, ticket);
        await this.save();
        return ticket;
    }

    async update(id, ticketData) {
        const existingTicket = await this.findById(id);
        if (!existingTicket) {
            throw new Error('Ticket not found');
        }

        const updatedTicket = new Ticket({
            ...existingTicket.toJSON(),
            ...ticketData,
            id,
            updatedAt: new Date().toISOString()
        });

        updatedTicket.validate();
        this.tickets.set(id, updatedTicket);
        await this.save();
        return updatedTicket;
    }

    async delete(id) {
        if (!this.tickets.has(id)) {
            throw new Error('Ticket not found');
        }
        this.tickets.delete(id);
        await this.save();
    }
}

module.exports = new TicketRepository(); 