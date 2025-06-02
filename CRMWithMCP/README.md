# AI Support Project

A microservice-based CRM system with AI support capabilities.

## Project Structure

```
ai_support_project/
├── README.md
├── frontend/
│   ├── index.html
│   └── script.js
└── services/
    ├── contacts-service/
    │   ├── package.json
    │   ├── index.js
    │   └── contacts.json
    ├── tickets-service/
    │   ├── package.json
    │   ├── index.js
    │   └── tickets.json
    ├── kb-service/
    │   ├── package.json
    │   ├── index.js
    │   └── kb-docs/
    │       ├── errors.md
    │       └── refund.md
    └── mcp-gateway/
        ├── package.json
        └── index.js
```

## Services and URLs

1. **Contacts Service** (Port 3001)
   - URL: `http://localhost:3001`
   - Endpoints: 
     - `GET /contacts` - List all contacts
     - `GET /contacts?email=<email>` - Find contact by email
     - `GET /contacts?id=<id>` - Find contact by ID

2. **Tickets Service** (Port 3002)
   - URL: `http://localhost:3002`
   - Endpoints:
     - `GET /tickets?crmId=<crmId>` - List open tickets for customer
     - `POST /tickets` - Create new ticket

3. **KB Service** (Port 3003)
   - URL: `http://localhost:3003`
   - Endpoints:
     - `GET /search?query=<query>` - Search knowledge base

4. **MCP Gateway** (Port 3000)
   - URL: `http://localhost:3000`
   - Endpoints:
     - `GET /mcp/tools` - List available MCP methods
     - `POST /mcp` - JSON-RPC endpoint

5. **Frontend** (Port 8000)
   - URL: `http://localhost:8000`
   - Static HTML/JS interface for testing

## Getting Started

1. **Install Dependencies**
   ```bash
   # Install for each service
   cd services/contacts-service && npm install
   cd ../tickets-service && npm install
   cd ../kb-service && npm install
   cd ../mcp-gateway && npm install
   ```

2. **Start Services**
   ```bash
   # Start each service in a separate terminal
   
   # Terminal 1 - Contacts Service
   cd services/contacts-service
   npm start
   
   # Terminal 2 - Tickets Service
   cd services/tickets-service
   npm start
   
   # Terminal 3 - KB Service
   cd services/kb-service
   npm start
   
   # Terminal 4 - MCP Gateway
   cd services/mcp-gateway
   npm start
   
   # Terminal 5 - Frontend Server
   cd frontend
   python3 -m http.server 8000
   ```

3. **Test the System**

   a. **Using the Frontend**:
   - Open `http://localhost:8000` in your browser
   - Select a method from the dropdown
   - Fill in the required parameters
   - Click "Call MCP" to see the response

   b. **Using curl**:
   ```bash
   # Test MCP Tools
   curl http://localhost:3000/mcp/tools

   # Test Customer Lookup
   curl "http://localhost:3001/contacts?email=alice@example.com"

   # Test Ticket Creation
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{
       "jsonrpc": "2.0",
       "method": "createSupportTicket",
       "params": {
         "crmId": "cust_123",
         "subject": "Test Ticket",
         "description": "Testing the system",
         "priority": "high"
       },
       "id": 1
     }'

   # Test KB Search
   curl "http://localhost:3003/search?query=refund"
   ```

## Sample Data

The system comes with sample data:

1. **Contacts** (`contacts.json`):
   - Alice Johnson (alice@example.com)
   - Bob Smith (bob@example.com)
   - Carol White (carol@example.com)

2. **Knowledge Base** (`kb-docs/`):
   - Refund Policy
   - Common Error Codes

## Development

Each service can be developed and tested independently. The MCP Gateway provides a unified interface for all services.

## License

MIT 