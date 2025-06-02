const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load contacts data
let contacts = [];
async function loadContacts() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8');
    contacts = JSON.parse(data).contacts;
  } catch (error) {
    console.error('Error loading contacts:', error);
    contacts = [];
  }
}

// Initialize contacts
loadContacts();

// GET /contacts
app.get('/contacts', (req, res) => {
  const { email, id } = req.query;
  
  if (email) {
    const matchingContacts = contacts.filter(contact => 
      contact.email.toLowerCase() === email.toLowerCase()
    );
    return res.json(matchingContacts);
  }
  
  if (id) {
    const contact = contacts.find(contact => contact.id === id);
    return res.json(contact || null);
  }
  
  res.json(contacts);
});

app.listen(PORT, () => {
  console.log(`Contacts service running on port ${PORT}`);
}); 