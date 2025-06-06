const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const gatewayRepository = require('../repositories/GatewayRepository');
const { v4: uuidv4 } = require('uuid');

// Service configurations
const services = {
    contacts: {
        url: process.env.CONTACTS_SERVICE_URL || 'http://localhost:3001',
        health: '/health'
    },
    tickets: {
        url: process.env.TICKETS_SERVICE_URL || 'http://localhost:3002',
        health: '/health'
    },
    kb: {
        url: process.env.KB_SERVICE_URL || 'http://localhost:3003',
        health: '/health'
    },
    ai: {
        url: process.env.AI_SERVICE_URL || 'http://localhost:3004',
        health: '/health'
    }
};

class GatewayController {
    async getAllServices(req, res) {
        try {
            const services = await gatewayRepository.findAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getServiceById(req, res) {
        try {
            const service = await gatewayRepository.findById(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createService(req, res) {
        try {
            const serviceData = {
                ...req.body,
                id: uuidv4()
            };
            const service = await gatewayRepository.create(serviceData);
            res.status(201).json(service);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateService(req, res) {
        try {
            const service = await gatewayRepository.update(req.params.id, req.body);
            res.json(service);
        } catch (error) {
            if (error.message === 'Service configuration not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async deleteService(req, res) {
        try {
            await gatewayRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Service configuration not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async forwardRequest(req, res) {
        try {
            const { serviceName } = req.params;
            const { method, path, data, headers } = req.body;

            const result = await gatewayRepository.forwardRequest(
                serviceName,
                method,
                path,
                data,
                headers
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async checkHealth(req, res) {
        try {
            const { serviceName } = req.params;
            const isHealthy = await gatewayRepository.checkHealth(serviceName);
            res.json({ healthy: isHealthy });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new GatewayController(); 