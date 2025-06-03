class KBDocument {
    constructor(data = {}) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.category = data.category;
        this.tags = data.tags || [];
        this.author = data.author;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    validate() {
        if (!this.title) {
            throw new Error('Title is required');
        }
        if (!this.content) {
            throw new Error('Content is required');
        }
        if (!this.category) {
            throw new Error('Category is required');
        }
        if (!Array.isArray(this.tags)) {
            throw new Error('Tags must be an array');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            category: this.category,
            tags: this.tags,
            author: this.author,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = KBDocument; 