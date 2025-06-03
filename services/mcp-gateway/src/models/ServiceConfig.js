class ServiceConfig {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.url = data.url;
        this.healthCheckEndpoint = data.healthCheckEndpoint || '/health';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.retryAttempts = data.retryAttempts || 3;
        this.timeout = data.timeout || 5000;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    validate() {
        if (!this.name) {
            throw new Error('Service name is required');
        }
        if (!this.url) {
            throw new Error('Service URL is required');
        }
        if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
            throw new Error('Invalid service URL format');
        }
        if (this.retryAttempts < 0) {
            throw new Error('Retry attempts must be non-negative');
        }
        if (this.timeout < 0) {
            throw new Error('Timeout must be non-negative');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            healthCheckEndpoint: this.healthCheckEndpoint,
            isActive: this.isActive,
            retryAttempts: this.retryAttempts,
            timeout: this.timeout,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = ServiceConfig; 