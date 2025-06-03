const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const ServiceConfig = require('../models/ServiceConfig');

class GatewayRepository {
    constructor() {
        this.dataFile = path.join(__dirname, '../../data/service-configs.json');
        this.services = new Map();
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
            const data = await fs.readFile(this.dataFile, 'utf8').catch(() => '[]');
            const configs = JSON.parse(data);
            configs.forEach(config => {
                this.services.set(config.id, new ServiceConfig(config));
            });
        } catch (error) {
            console.error('Error initializing gateway repository:', error);
            throw error;
        }
    }

    async save() {
        try {
            const configs = Array.from(this.services.values()).map(config => config.toJSON());
            await fs.writeFile(this.dataFile, JSON.stringify(configs, null, 2));
        } catch (error) {
            console.error('Error saving service configurations:', error);
            throw error;
        }
    }

    async findAll() {
        return Array.from(this.services.values());
    }

    async findById(id) {
        return this.services.get(id);
    }

    async findByName(name) {
        return Array.from(this.services.values())
            .find(service => service.name === name);
    }

    async create(configData) {
        const config = new ServiceConfig(configData);
        config.validate();
        this.services.set(config.id, config);
        await this.save();
        return config;
    }

    async update(id, configData) {
        const existingConfig = await this.findById(id);
        if (!existingConfig) {
            throw new Error('Service configuration not found');
        }

        const updatedConfig = new ServiceConfig({
            ...existingConfig.toJSON(),
            ...configData,
            id,
            updatedAt: new Date().toISOString()
        });

        updatedConfig.validate();
        this.services.set(id, updatedConfig);
        await this.save();
        return updatedConfig;
    }

    async delete(id) {
        if (!this.services.has(id)) {
            throw new Error('Service configuration not found');
        }
        this.services.delete(id);
        await this.save();
    }

    async forwardRequest(serviceName, method, path, data = null, headers = {}) {
        const service = await this.findByName(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        if (!service.isActive) {
            throw new Error(`Service ${serviceName} is not active`);
        }

        const url = `${service.url}${path}`;
        const config = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            timeout: service.timeout
        };

        if (data) {
            config.data = data;
        }

        let lastError;
        for (let attempt = 0; attempt <= service.retryAttempts; attempt++) {
            try {
                const response = await axios(config);
                return response.data;
            } catch (error) {
                lastError = error;
                if (attempt < service.retryAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        throw lastError;
    }

    async checkHealth(serviceName) {
        const service = await this.findByName(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }

        try {
            const response = await axios.get(`${service.url}${service.healthCheckEndpoint}`, {
                timeout: service.timeout
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new GatewayRepository(); 