const natural = require('natural');
const nlp = require('compromise');
const Sentiment = require('sentiment');
const fetch = require('node-fetch');

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const sentiment = new Sentiment();
const TfIdf = natural.TfIdf;

// Chat history for context
let chatHistory = [];

// Handle chat messages
exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        chatHistory.push({ role: 'user', content: message });

        // Analyze message intent
        const intent = analyzeIntent(message);
        let response;

        switch (intent) {
            case 'contact':
                response = await handleContactQuery(message);
                break;
            case 'ticket':
                response = await handleTicketQuery(message);
                break;
            case 'kb':
                response = await handleKBQuery(message);
                break;
            default:
                response = generateGeneralResponse(message);
        }

        chatHistory.push({ role: 'assistant', content: response });
        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

// Get contact suggestions
exports.getContactSuggestions = async (req, res) => {
    try {
        const suggestions = [
            'Consider adding more contact details for better organization',
            'Recent contacts might need follow-up',
            'Some contacts have similar interests - consider grouping them',
            'Update contact information for better accuracy',
            'Review contact interaction history for insights'
        ];
        res.json(suggestions);
    } catch (error) {
        console.error('Contact suggestions error:', error);
        res.status(500).json({ error: 'Failed to get contact suggestions' });
    }
};

// Get ticket predictions
exports.getTicketPredictions = async (req, res) => {
    try {
        const predictions = [
            'High priority tickets might need immediate attention',
            'Some tickets are close to resolution',
            'Consider assigning more resources to complex tickets',
            'Review ticket patterns for common issues',
            'Monitor ticket response times for improvement'
        ];
        res.json(predictions);
    } catch (error) {
        console.error('Ticket predictions error:', error);
        res.status(500).json({ error: 'Failed to get ticket predictions' });
    }
};

// Get related articles
exports.getRelatedArticles = async (req, res) => {
    try {
        const articles = [
            { title: 'Best Practices for Customer Support', relevance: 0.9 },
            { title: 'Handling Common Customer Issues', relevance: 0.8 },
            { title: 'Improving Response Times', relevance: 0.7 },
            { title: 'Customer Communication Tips', relevance: 0.6 },
            { title: 'Support Ticket Management', relevance: 0.5 }
        ];
        res.json(articles);
    } catch (error) {
        console.error('Related articles error:', error);
        res.status(500).json({ error: 'Failed to get related articles' });
    }
};

// Analyze sentiment
exports.analyzeSentiment = async (req, res) => {
    try {
        const { text } = req.body;
        const result = sentiment.analyze(text);
        
        let sentimentLabel;
        if (result.score > 0) {
            sentimentLabel = 'positive';
        } else if (result.score < 0) {
            sentimentLabel = 'negative';
        } else {
            sentimentLabel = 'neutral';
        }

        res.json({
            sentiment: sentimentLabel,
            score: result.score,
            comparative: result.comparative,
            words: result.words
        });
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
};

// Suggest content
exports.suggestContent = async (req, res) => {
    try {
        const { text } = req.body;
        const doc = nlp(text);
        
        // Extract key phrases
        const keyPhrases = doc.keywords().out('array');
        
        // Generate suggestions
        const suggestions = [
            'Consider adding more specific details',
            'Include relevant examples',
            'Add a clear call to action',
            'Structure the content with headings',
            'Include relevant statistics or data'
        ];

        res.json({
            keyPhrases,
            suggestions
        });
    } catch (error) {
        console.error('Content suggestions error:', error);
        res.status(500).json({ error: 'Failed to suggest content' });
    }
};

// Suggest tags
exports.suggestTags = async (req, res) => {
    try {
        const { text } = req.body;
        const doc = nlp(text);
        
        // Extract nouns and topics
        const nouns = doc.nouns().out('array');
        const topics = doc.topics().out('array');
        
        // Combine and deduplicate
        const tags = [...new Set([...nouns, ...topics])];
        
        res.json(tags);
    } catch (error) {
        console.error('Tag suggestions error:', error);
        res.status(500).json({ error: 'Failed to suggest tags' });
    }
};

// Helper functions
function analyzeIntent(message) {
    const doc = nlp(message);
    
    if (doc.has('contact') || doc.has('customer')) {
        return 'contact';
    } else if (doc.has('ticket') || doc.has('issue')) {
        return 'ticket';
    } else if (doc.has('article') || doc.has('document')) {
        return 'kb';
    }
    
    return 'general';
}

async function handleContactQuery(message) {
    // Implement contact-related response generation
    return 'I can help you with contact management. What specific information do you need?';
}

async function handleTicketQuery(message) {
    // Implement ticket-related response generation
    return 'I can help you with ticket management. What would you like to know?';
}

async function handleKBQuery(message) {
    // Implement knowledge base query handling
    return 'I can help you find relevant articles in the knowledge base. What are you looking for?';
}

function generateGeneralResponse(message) {
    // Implement general response generation
    return 'I\'m here to help with your CRM needs. How can I assist you today?';
} 