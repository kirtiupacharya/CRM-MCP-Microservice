const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/GatewayController');

// Service management routes
router.get('/services', gatewayController.getAllServices);
router.get('/services/:id', gatewayController.getServiceById);
router.post('/services', gatewayController.createService);
router.put('/services/:id', gatewayController.updateService);
router.delete('/services/:id', gatewayController.deleteService);

// Health check routes
router.get('/health/:serviceName', gatewayController.checkHealth);

// Forwarding routes
router.all('/contacts/*', gatewayController.forwardRequest);
router.all('/tickets/*', gatewayController.forwardRequest);
router.all('/kb/*', gatewayController.forwardRequest);
router.all('/ai/*', gatewayController.forwardRequest);

module.exports = router; 