class Contact {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.company = data.company;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    validate() {
        if (!this.name) {
            throw new Error('Name is required');
        }
        if (!this.email) {
            throw new Error('Email is required');
        }
        if (!this.email.includes('@')) {
            throw new Error('Invalid email format');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            company: this.company,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Contact; 