// MCP Gateway URL
const MCP_URL = 'http://localhost:3000/mcp';

// UI Elements
const loading = document.querySelector('.loading');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.closest('.nav-link').dataset.section;
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.closest('.nav-link').classList.add('active');
        
        // Show selected section
        sections.forEach(s => s.style.display = 'none');
        document.getElementById(`${section}-section`).style.display = 'block';
    });
});

// Show loading indicator
function showLoading() {
    loading.style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    loading.style.display = 'none';
}

// Format JSON response
function formatResponse(data) {
    return JSON.stringify(data, null, 2);
}

// Handle MCP calls
async function callMCP(method, params) {
    showLoading();
    console.log(`Calling MCP method: ${method}`, params);
    
    try {
        const response = await fetch(MCP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
                id: Date.now()
            })
        });
        
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);
        
        hideLoading();
        return result;
    } catch (error) {
        console.error('Error calling MCP:', error);
        hideLoading();
        throw error;
    }
}

// Customer Lookup
document.getElementById('customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const responseArea = document.getElementById('customer-response');
    
    try {
        console.log('Looking up customer with email:', email);
        const result = await callMCP('getCustomerByEmail', { email });
        responseArea.textContent = formatResponse(result);
    } catch (error) {
        console.error('Customer lookup error:', error);
        responseArea.textContent = `Error: ${error.message}`;
    }
});

// Create Ticket
document.getElementById('ticket-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const responseArea = document.getElementById('tickets-list');
    
    const params = {
        crmId: document.getElementById('crmId').value,
        subject: document.getElementById('subject').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value
    };
    
    try {
        console.log('Creating ticket with params:', params);
        const result = await callMCP('createSupportTicket', params);
        responseArea.textContent = formatResponse(result);
        
        // Clear form
        e.target.reset();
    } catch (error) {
        console.error('Create ticket error:', error);
        responseArea.textContent = `Error: ${error.message}`;
    }
});

// List Tickets
document.getElementById('list-tickets-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const responseArea = document.getElementById('tickets-list');
    const crmId = document.getElementById('list-crmId').value;
    
    try {
        console.log('Listing tickets for customer:', crmId);
        const result = await callMCP('listOpenTickets', { crmId });
        responseArea.textContent = formatResponse(result);
    } catch (error) {
        console.error('List tickets error:', error);
        responseArea.textContent = `Error: ${error.message}`;
    }
});

// Knowledge Base Search
document.getElementById('kb-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const responseArea = document.getElementById('kb-results');
    const query = document.getElementById('query').value;
    
    try {
        console.log('Searching KB with query:', query);
        const result = await callMCP('searchKB', { query });
        responseArea.textContent = formatResponse(result);
    } catch (error) {
        console.error('KB search error:', error);
        responseArea.textContent = `Error: ${error.message}`;
    }
}); 