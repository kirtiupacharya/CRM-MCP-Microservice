# CRM System with Microservices Architecture

A modern Customer Relationship Management (CRM) system built using a microservices architecture. The system consists of multiple services that handle different aspects of customer management, support tickets, and knowledge base.

## Architecture

The system follows a layered architecture pattern for each microservice:

- **Models Layer**: Defines data structures and validation rules
- **Repository Layer**: Handles data persistence and CRUD operations
- **Controller Layer**: Manages business logic and request/response handling
- **Routes Layer**: Defines API endpoints and request routing

## Services

### 1. Contacts Service (Port: 3001)
Manages customer contact information.
- Create, read, update, and delete contacts
- Validate contact information
- Store contact details with timestamps

### 2. Tickets Service (Port: 3002)
Handles customer support tickets.
- Create and manage support tickets
- Track ticket status and priority
- Associate tickets with contacts
- Filter tickets by contact

### 3. Knowledge Base Service (Port: 3003)
Manages documentation and knowledge articles.
- Create and maintain knowledge base articles
- Categorize and tag articles
- Search functionality
- Version control for articles

### 4. MCP Gateway Service (Port: 3000)
API Gateway that manages service communication.
- Route requests to appropriate services
- Service health monitoring
- Request retry mechanism
- Service configuration management

## Project Structure

```
CRMWithMCP/
├── services/
│   ├── contacts-service/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── app.js
│   │   └── package.json
│   ├── tickets-service/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── app.js
│   │   └── package.json
│   ├── kb-service/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── app.js
│   │   └── package.json
│   └── mcp-gateway/
│       ├── src/
│       │   ├── models/
│       │   ├── controllers/
│       │   ├── repositories/
│       │   ├── routes/
│       │   └── app.js
│       └── package.json
└── README.md
```

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CRMWithMCP
```

2. Install dependencies for each service:
```bash
cd services/contacts-service && npm install
cd ../tickets-service && npm install
cd ../kb-service && npm install
cd ../mcp-gateway && npm install
```

3. Start the services:

In separate terminal windows, run:
```bash
# Start MCP Gateway
cd services/mcp-gateway
npm run dev

# Start Contacts Service
cd services/contacts-service
npm run dev

# Start Tickets Service
cd services/tickets-service
npm run dev

# Start KB Service
cd services/kb-service
npm run dev
```

## API Endpoints

### Contacts Service (http://localhost:3001)
- GET /api/contacts - Get all contacts
- GET /api/contacts/:id - Get contact by ID
- POST /api/contacts - Create new contact
- PUT /api/contacts/:id - Update contact
- DELETE /api/contacts/:id - Delete contact

### Tickets Service (http://localhost:3002)
- GET /api/tickets - Get all tickets
- GET /api/tickets/:id - Get ticket by ID
- GET /api/tickets/contact/:contactId - Get tickets by contact
- POST /api/tickets - Create new ticket
- PUT /api/tickets/:id - Update ticket
- DELETE /api/tickets/:id - Delete ticket

### Knowledge Base Service (http://localhost:3003)
- GET /api/kb - Get all documents
- GET /api/kb/search - Search documents
- GET /api/kb/:id - Get document by ID
- GET /api/kb/category/:category - Get documents by category
- GET /api/kb/tag/:tag - Get documents by tag
- POST /api/kb - Create new document
- PUT /api/kb/:id - Update document
- DELETE /api/kb/:id - Delete document

### MCP Gateway (http://localhost:3000)
- GET /api/gateway/services - Get all services
- GET /api/gateway/services/:id - Get service by ID
- POST /api/gateway/services - Create new service
- PUT /api/gateway/services/:id - Update service
- DELETE /api/gateway/services/:id - Delete service
- POST /api/gateway/forward/:serviceName - Forward request to service
- GET /api/gateway/health/:serviceName - Check service health

## Development

Each service can be run in development mode using:
```bash
npm run dev
```

This will start the service with nodemon for automatic reloading on file changes.

## Data Storage

Currently, the services use JSON files for data storage. The data files are stored in the `data` directory of each service:
- contacts-service/data/contacts.json
- tickets-service/data/tickets.json
- kb-service/data/kb-documents.json
- mcp-gateway/data/service-configs.json

## Error Handling

All services implement consistent error handling:
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 