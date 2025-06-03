const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactController');

// Get all contacts
router.get('/', contactController.getAllContacts);

// Get contact by ID
router.get('/:id', contactController.getContactById);

// Create new contact
router.post('/', contactController.createContact);

// Update contact
router.put('/:id', contactController.updateContact);

// Delete contact
router.delete('/:id', contactController.deleteContact);

module.exports = router; 