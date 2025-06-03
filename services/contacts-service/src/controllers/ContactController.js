const contactRepository = require('../repositories/ContactRepository');
const { v4: uuidv4 } = require('uuid');

class ContactController {
    async getAllContacts(req, res) {
        try {
            const contacts = await contactRepository.findAll();
            res.json(contacts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getContactById(req, res) {
        try {
            const contact = await contactRepository.findById(req.params.id);
            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json(contact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createContact(req, res) {
        try {
            const contactData = {
                ...req.body,
                id: uuidv4()
            };
            const contact = await contactRepository.create(contactData);
            res.status(201).json(contact);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateContact(req, res) {
        try {
            const contact = await contactRepository.update(req.params.id, req.body);
            res.json(contact);
        } catch (error) {
            if (error.message === 'Contact not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async deleteContact(req, res) {
        try {
            await contactRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Contact not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ContactController(); 