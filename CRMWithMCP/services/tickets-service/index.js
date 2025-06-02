const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Load tickets data
let tickets = [];
async function loadTickets() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'tickets.json'), 'utf8');
    tickets = JSON.parse(data).tickets;
  } catch (error) {
    console.error('Error loading tickets:', error);
    tickets = [];
  }
}

// Save tickets data
async function saveTickets() {
  try {
    await fs.writeFile(
      path.join(__dirname, 'tickets.json'),
      JSON.stringify({ tickets }, null, 2)
    );
  } catch (error) {
    console.error('Error saving tickets:', error);
  }
}

// Initialize tickets
loadTickets();

// GET /tickets
app.get('/tickets', (req, res) => {
  const { crmId } = req.query;
  
  if (crmId) {
    const customerTickets = tickets.filter(ticket => 
      ticket.crmId === crmId && ticket.status === 'open'
    );
    return res.json(customerTickets);
  }
  
  res.json(tickets);
});

// POST /tickets
app.post('/tickets', async (req, res) => {
  const { crmId, subject, description, priority } = req.body;
  
  if (!crmId || !subject || !description || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newTicket = {
    ticketId: uuidv4(),
    crmId,
    subject,
    description,
    priority,
    status: 'open',
    created_at: new Date().toISOString()
  };
  
  tickets.push(newTicket);
  await saveTickets();
  
  res.status(201).json({
    ticketId: newTicket.ticketId,
    created_at: newTicket.created_at
  });
});

app.listen(PORT, () => {
  console.log(`Tickets service running on port ${PORT}`);
}); 