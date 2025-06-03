class Ticket {
    constructor(data = {}) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status || 'open';
        this.priority = data.priority || 'medium';
        this.contactId = data.contactId;
        this.assignedTo = data.assignedTo;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    validate() {
        if (!this.title) {
            throw new Error('Title is required');
        }
        if (!this.description) {
            throw new Error('Description is required');
        }
        if (!this.contactId) {
            throw new Error('Contact ID is required');
        }
        if (!['open', 'in-progress', 'resolved', 'closed'].includes(this.status)) {
            throw new Error('Invalid status');
        }
        if (!['low', 'medium', 'high'].includes(this.priority)) {
            throw new Error('Invalid priority');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            contactId: this.contactId,
            assignedTo: this.assignedTo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Ticket; 