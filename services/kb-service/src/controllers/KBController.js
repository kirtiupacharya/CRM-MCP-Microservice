const kbRepository = require('../repositories/KBRepository');
const { v4: uuidv4 } = require('uuid');

class KBController {
    async getAllDocuments(req, res) {
        try {
            const documents = await kbRepository.findAll();
            res.json(documents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDocumentById(req, res) {
        try {
            const document = await kbRepository.findById(req.params.id);
            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }
            res.json(document);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDocumentsByCategory(req, res) {
        try {
            const documents = await kbRepository.findByCategory(req.params.category);
            res.json(documents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDocumentsByTag(req, res) {
        try {
            const documents = await kbRepository.findByTag(req.params.tag);
            res.json(documents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async searchDocuments(req, res) {
        try {
            const documents = await kbRepository.search(req.query.q);
            res.json(documents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createDocument(req, res) {
        try {
            const documentData = {
                ...req.body,
                id: uuidv4()
            };
            const document = await kbRepository.create(documentData);
            res.status(201).json(document);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateDocument(req, res) {
        try {
            const document = await kbRepository.update(req.params.id, req.body);
            res.json(document);
        } catch (error) {
            if (error.message === 'Document not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async deleteDocument(req, res) {
        try {
            await kbRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Document not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new KBController(); 