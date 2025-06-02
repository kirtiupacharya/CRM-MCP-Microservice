const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs
const CONTACTS_URL = process.env.CONTACTS_URL || 'http://localhost:3001';
const TICKETS_URL = process.env.TICKETS_URL || 'http://localhost:3002';
const KB_URL = process.env.KB_URL || 'http://localhost:3003';

app.use(express.json());
app.use(cors());

// MCP Tools schema
const mcpTools = {
  getCustomerByEmail: {
    description: "Get customer details by email",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Customer's email address"
        }
      },
      required: ["email"]
    }
  },
  listOpenTickets: {
    description: "List open tickets for a customer",
    parameters: {
      type: "object",
      properties: {
        crmId: {
          type: "string",
          description: "Customer's CRM ID"
        }
      },
      required: ["crmId"]
    }
  },
  createSupportTicket: {
    description: "Create a new support ticket",
    parameters: {
      type: "object",
      properties: {
        crmId: {
          type: "string",
          description: "Customer's CRM ID"
        },
        subject: {
          type: "string",
          description: "Ticket subject"
        },
        description: {
          type: "string",
          description: "Ticket description"
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Ticket priority"
        }
      },
      required: ["crmId", "subject", "description", "priority"]
    }
  },
  searchKB: {
    description: "Search the knowledge base",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query"
        }
      },
      required: ["query"]
    }
  }
};

// GET /mcp/tools
app.get('/mcp/tools', (req, res) => {
  res.json(mcpTools);
});

// POST /mcp
app.post('/mcp', async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;
  
  if (jsonrpc !== '2.0' || !method || !params || !id) {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request'
      },
      id: null
    });
  }
  
  try {
    let result;
    
    switch (method) {
      case 'getCustomerByEmail':
        const contactsResponse = await axios.get(`${CONTACTS_URL}/contacts`, {
          params: { email: params.email }
        });
        result = contactsResponse.data[0] || null;
        break;
        
      case 'listOpenTickets':
        const ticketsResponse = await axios.get(`${TICKETS_URL}/tickets`, {
          params: { crmId: params.crmId }
        });
        result = ticketsResponse.data;
        break;
        
      case 'createSupportTicket':
        const createResponse = await axios.post(`${TICKETS_URL}/tickets`, params);
        result = createResponse.data;
        break;
        
      case 'searchKB':
        const kbResponse = await axios.get(`${KB_URL}/search`, {
          params: { query: params.query }
        });
        result = kbResponse.data;
        break;
        
      default:
        return res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: 'Method not found'
          },
          id
        });
    }
    
    res.json({
      jsonrpc: '2.0',
      result,
      id
    });
  } catch (error) {
    console.error('MCP Gateway error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error'
      },
      id
    });
  }
});

app.listen(PORT, () => {
  console.log(`MCP Gateway running on port ${PORT}`);
}); 