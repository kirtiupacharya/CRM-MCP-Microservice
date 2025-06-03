const express = require('express');
const router = express.Router();
const kbController = require('../controllers/KBController');

// Get all documents
router.get('/', kbController.getAllDocuments);

// Search documents
router.get('/search', kbController.searchDocuments);

// Get document by ID
router.get('/:id', kbController.getDocumentById);

// Get documents by category
router.get('/category/:category', kbController.getDocumentsByCategory);

// Get documents by tag
router.get('/tag/:tag', kbController.getDocumentsByTag);

// Create new document
router.post('/', kbController.createDocument);

// Update document
router.put('/:id', kbController.updateDocument);

// Delete document
router.delete('/:id', kbController.deleteDocument);

module.exports = router; 