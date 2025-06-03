const fs = require('fs').promises;
const path = require('path');
const Contact = require('../models/Contact');

class ContactRepository {
    constructor() {
        this.dataFile = path.join(__dirname, '../../data/contacts.json');
        this.contacts = new Map();
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
            const data = await fs.readFile(this.dataFile, 'utf8').catch(() => '[]');
            const contacts = JSON.parse(data);
            contacts.forEach(contact => {
                this.contacts.set(contact.id, new Contact(contact));
            });
        } catch (error) {
            console.error('Error initializing contact repository:', error);
            throw error;
        }
    }

    async save() {
        try {
            const contacts = Array.from(this.contacts.values()).map(contact => contact.toJSON());
            await fs.writeFile(this.dataFile, JSON.stringify(contacts, null, 2));
        } catch (error) {
            console.error('Error saving contacts:', error);
            throw error;
        }
    }

    async findAll() {
        return Array.from(this.contacts.values());
    }

    async findById(id) {
        return this.contacts.get(id);
    }

    async create(contactData) {
        const contact = new Contact(contactData);
        contact.validate();
        this.contacts.set(contact.id, contact);
        await this.save();
        return contact;
    }

    async update(id, contactData) {
        const existingContact = await this.findById(id);
        if (!existingContact) {
            throw new Error('Contact not found');
        }

        const updatedContact = new Contact({
            ...existingContact.toJSON(),
            ...contactData,
            id,
            updatedAt: new Date().toISOString()
        });

        updatedContact.validate();
        this.contacts.set(id, updatedContact);
        await this.save();
        return updatedContact;
    }

    async delete(id) {
        if (!this.contacts.has(id)) {
            throw new Error('Contact not found');
        }
        this.contacts.delete(id);
        await this.save();
    }
}

module.exports = new ContactRepository(); 