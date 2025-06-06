// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const GATEWAY_URL = `${API_BASE_URL}/gateway`;

// UI Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const contactsList = document.getElementById('contacts-list');
const ticketsList = document.getElementById('tickets-list');
const kbDocuments = document.getElementById('kb-documents');
const kbSearch = document.getElementById('kb-search');

// Global variables
let contacts = [];
let tickets = [];
let kbDocuments = [];
let currentSection = 'contacts';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeAIAssistant();
    loadData();
    setupEventListeners();
});

// Navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            showSection(section);
        });
    });
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });
    currentSection = section;
}

// AI Assistant
function initializeAIAssistant() {
    const toggleBtn = document.getElementById('ai-assistant-toggle');
    const assistant = document.getElementById('ai-assistant');
    const closeBtn = document.getElementById('close-ai-assistant');
    const chatInput = assistant.querySelector('.chat-input input');
    const sendBtn = assistant.querySelector('.chat-input button');

    toggleBtn.addEventListener('click', () => {
        assistant.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
        assistant.classList.remove('active');
    });

    sendBtn.addEventListener('click', handleAIChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAIChat();
    });
}

async function handleAIChat() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    if (!message) return;

    const chatMessages = document.querySelector('.chat-messages');
    appendMessage('user', message);
    input.value = '';

    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        appendMessage('assistant', data.response);
    } catch (error) {
        appendMessage('error', 'Sorry, I encountered an error. Please try again.');
    }
}

function appendMessage(type, content) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} animate-fade-in`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>
            <span>${content}</span>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Data Loading
async function loadData() {
    try {
        const [contactsRes, ticketsRes, kbRes] = await Promise.all([
            fetch('/api/contacts'),
            fetch('/api/tickets'),
            fetch('/api/kb')
        ]);

        contacts = await contactsRes.json();
        tickets = await ticketsRes.json();
        kbDocuments = await kbRes.json();

        renderContacts();
        renderTickets();
        renderKBDocuments();
        updateAISuggestions();
    } catch (error) {
        showError('Failed to load data. Please try again.');
    }
}

// Event Listeners
function setupEventListeners() {
    // Contact search
    document.getElementById('contact-search').addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        const filtered = contacts.filter(contact => 
            contact.name.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            contact.company.toLowerCase().includes(query)
        );
        renderContacts(filtered);
    }, 300));

    // Ticket filter
    document.getElementById('ticket-filter').addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        const filtered = tickets.filter(ticket =>
            ticket.title.toLowerCase().includes(query) ||
            ticket.description.toLowerCase().includes(query)
        );
        renderTickets(filtered);
    }, 300));

    // KB search
    document.getElementById('kb-search').addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        const filtered = kbDocuments.filter(doc =>
            doc.title.toLowerCase().includes(query) ||
            doc.content.toLowerCase().includes(query)
        );
        renderKBDocuments(filtered);
    }, 300));
}

// Rendering Functions
function renderContacts(contactsToRender = contacts) {
    const tbody = document.getElementById('contacts-list');
    tbody.innerHTML = contactsToRender.map(contact => `
        <tr class="animate-fade-in">
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.company}</td>
            <td>
                <div class="ai-tags">
                    ${generateAITags(contact)}
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editContact(${contact.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${contact.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderTickets(ticketsToRender = tickets) {
    const tbody = document.getElementById('tickets-list');
    tbody.innerHTML = ticketsToRender.map(ticket => `
        <tr class="animate-fade-in">
            <td>${ticket.title}</td>
            <td><span class="badge bg-${getStatusColor(ticket.status)}">${ticket.status}</span></td>
            <td><span class="badge bg-${getPriorityColor(ticket.priority)}">${ticket.priority}</span></td>
            <td>${getContactName(ticket.contactId)}</td>
            <td>
                <div class="sentiment-indicator ${getSentimentClass(ticket.sentiment)}">
                    <i class="fas fa-${getSentimentIcon(ticket.sentiment)}"></i>
                    ${ticket.sentiment}
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editTicket(${ticket.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTicket(${ticket.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderKBDocuments(docsToRender = kbDocuments) {
    const container = document.getElementById('kb-documents');
    container.innerHTML = docsToRender.map(doc => `
        <div class="col-md-6 mb-4">
            <div class="card animate-slide-up">
                <div class="card-body">
                    <h5 class="card-title">${doc.title}</h5>
                    <p class="card-text">${truncateText(doc.content, 150)}</p>
                    <div class="ai-tags mb-3">
                        ${generateAITags(doc)}
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewKBDocument(${doc.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// AI Features
function updateAISuggestions() {
    updateContactSuggestions();
    updateTicketPredictions();
    updateRelatedArticles();
}

async function updateContactSuggestions() {
    try {
        const response = await fetch('/api/ai/contact-suggestions');
        const suggestions = await response.json();
        const container = document.getElementById('contact-suggestions');
        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item animate-fade-in">
                <i class="fas fa-lightbulb"></i>
                <span>${suggestion}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load contact suggestions:', error);
    }
}

async function updateTicketPredictions() {
    try {
        const response = await fetch('/api/ai/ticket-predictions');
        const predictions = await response.json();
        const container = document.getElementById('ticket-predictions');
        container.innerHTML = predictions.map(prediction => `
            <div class="prediction-item animate-fade-in">
                <i class="fas fa-chart-line"></i>
                <span>${prediction}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load ticket predictions:', error);
    }
}

async function updateRelatedArticles() {
    try {
        const response = await fetch('/api/ai/related-articles');
        const articles = await response.json();
        const container = document.getElementById('related-articles');
        container.innerHTML = articles.map(article => `
            <div class="article-item animate-fade-in">
                <i class="fas fa-link"></i>
                <span>${article.title}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load related articles:', error);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function getStatusColor(status) {
    const colors = {
        'open': 'success',
        'in-progress': 'warning',
        'closed': 'secondary'
    };
    return colors[status] || 'primary';
}

function getPriorityColor(priority) {
    const colors = {
        'low': 'success',
        'medium': 'warning',
        'high': 'danger'
    };
    return colors[priority] || 'primary';
}

function getSentimentClass(sentiment) {
    const classes = {
        'positive': 'text-success',
        'neutral': 'text-warning',
        'negative': 'text-danger'
    };
    return classes[sentiment] || 'text-secondary';
}

function getSentimentIcon(sentiment) {
    const icons = {
        'positive': 'smile',
        'neutral': 'meh',
        'negative': 'frown'
    };
    return icons[sentiment] || 'question';
}

function getContactName(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
}

function generateAITags(item) {
    if (!item.aiTags) return '';
    return item.aiTags.map(tag => `
        <span class="badge bg-info me-1">
            <i class="fas fa-tag"></i> ${tag}
        </span>
    `).join('');
}

// Error Handling
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
}

// Modal Functions
function showAddContactModal() {
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    document.getElementById('contact-form').reset();
    modal.show();
}

function showAddTicketModal() {
    const modal = new bootstrap.Modal(document.getElementById('ticketModal'));
    document.getElementById('ticket-form').reset();
    populateContactSelect();
    modal.show();
}

function showAddKBDocumentModal() {
    const modal = new bootstrap.Modal(document.getElementById('kbDocumentModal'));
    document.getElementById('kb-document-form').reset();
    modal.show();
}

// Form Submission
async function saveContact() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const contact = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            const newContact = await response.json();
            contacts.push(newContact);
            renderContacts();
            showSuccess('Contact added successfully');
            bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
        } else {
            throw new Error('Failed to add contact');
        }
    } catch (error) {
        showError(error.message);
    }
}

async function saveTicket() {
    const form = document.getElementById('ticket-form');
    const formData = new FormData(form);
    const ticket = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket)
        });

        if (response.ok) {
            const newTicket = await response.json();
            tickets.push(newTicket);
            renderTickets();
            showSuccess('Ticket created successfully');
            bootstrap.Modal.getInstance(document.getElementById('ticketModal')).hide();
        } else {
            throw new Error('Failed to create ticket');
        }
    } catch (error) {
        showError(error.message);
    }
}

async function saveKBDocument() {
    const form = document.getElementById('kb-document-form');
    const formData = new FormData(form);
    const document = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/kb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(document)
        });

        if (response.ok) {
            const newDoc = await response.json();
            kbDocuments.push(newDoc);
            renderKBDocuments();
            showSuccess('Document added successfully');
            bootstrap.Modal.getInstance(document.getElementById('kbDocumentModal')).hide();
        } else {
            throw new Error('Failed to add document');
        }
    } catch (error) {
        showError(error.message);
    }
}

// Analytics Functions
function showContactInsights() {
    // Implement contact analytics visualization
    const ctx = document.createElement('canvas');
    const container = document.createElement('div');
    container.className = 'analytics-container';
    container.appendChild(ctx);
    
    Swal.fire({
        title: 'Contact Analytics',
        html: container,
        width: '80%',
        showConfirmButton: false,
        showCloseButton: true
    });

    // Add chart visualization here
}

function showTicketAnalytics() {
    // Implement ticket analytics visualization
    const ctx = document.createElement('canvas');
    const container = document.createElement('div');
    container.className = 'analytics-container';
    container.appendChild(ctx);
    
    Swal.fire({
        title: 'Ticket Analytics',
        html: container,
        width: '80%',
        showConfirmButton: false,
        showCloseButton: true
    });

    // Add chart visualization here
}

function showKBAnalytics() {
    // Implement KB analytics visualization
    const ctx = document.createElement('canvas');
    const container = document.createElement('div');
    container.className = 'analytics-container';
    container.appendChild(ctx);
    
    Swal.fire({
        title: 'Knowledge Base Analytics',
        html: container,
        width: '80%',
        showConfirmButton: false,
        showCloseButton: true
    });

    // Add chart visualization here
} 