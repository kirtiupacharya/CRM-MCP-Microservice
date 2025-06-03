const fs = require('fs').promises;
const path = require('path');
const KBDocument = require('../models/KBDocument');

class KBRepository {
    constructor() {
        this.dataFile = path.join(__dirname, '../../data/kb-documents.json');
        this.documents = new Map();
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
            const data = await fs.readFile(this.dataFile, 'utf8').catch(() => '[]');
            const documents = JSON.parse(data);
            documents.forEach(doc => {
                this.documents.set(doc.id, new KBDocument(doc));
            });
        } catch (error) {
            console.error('Error initializing KB repository:', error);
            throw error;
        }
    }

    async save() {
        try {
            const documents = Array.from(this.documents.values()).map(doc => doc.toJSON());
            await fs.writeFile(this.dataFile, JSON.stringify(documents, null, 2));
        } catch (error) {
            console.error('Error saving KB documents:', error);
            throw error;
        }
    }

    async findAll() {
        return Array.from(this.documents.values());
    }

    async findById(id) {
        return this.documents.get(id);
    }

    async findByCategory(category) {
        return Array.from(this.documents.values())
            .filter(doc => doc.category === category);
    }

    async findByTag(tag) {
        return Array.from(this.documents.values())
            .filter(doc => doc.tags.includes(tag));
    }

    async search(query) {
        const searchTerm = query.toLowerCase();
        return Array.from(this.documents.values())
            .filter(doc => 
                doc.title.toLowerCase().includes(searchTerm) ||
                doc.content.toLowerCase().includes(searchTerm) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
    }

    async create(documentData) {
        const document = new KBDocument(documentData);
        document.validate();
        this.documents.set(document.id, document);
        await this.save();
        return document;
    }

    async update(id, documentData) {
        const existingDocument = await this.findById(id);
        if (!existingDocument) {
            throw new Error('Document not found');
        }

        const updatedDocument = new KBDocument({
            ...existingDocument.toJSON(),
            ...documentData,
            id,
            updatedAt: new Date().toISOString()
        });

        updatedDocument.validate();
        this.documents.set(id, updatedDocument);
        await this.save();
        return updatedDocument;
    }

    async delete(id) {
        if (!this.documents.has(id)) {
            throw new Error('Document not found');
        }
        this.documents.delete(id);
        await this.save();
    }
}

module.exports = new KBRepository(); 