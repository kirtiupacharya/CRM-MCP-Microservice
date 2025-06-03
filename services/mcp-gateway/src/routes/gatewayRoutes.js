const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/GatewayController');

// Get all services
router.get('/services', gatewayController.getAllServices);

// Get service by ID
router.get('/services/:id', gatewayController.getServiceById);

// Create new service
router.post('/services', gatewayController.createService);

// Update service
router.put('/services/:id', gatewayController.updateService);

// Delete service
router.delete('/services/:id', gatewayController.deleteService);

// Forward request to service
router.post('/forward/:serviceName', gatewayController.forwardRequest);

// Check service health
router.get('/health/:serviceName', gatewayController.checkHealth);

module.exports = router; 