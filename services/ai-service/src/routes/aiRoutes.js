const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Chat endpoint
router.post('/chat', aiController.handleChat);

// Contact suggestions
router.get('/contact-suggestions', aiController.getContactSuggestions);

// Ticket predictions
router.get('/ticket-predictions', aiController.getTicketPredictions);

// Related articles
router.get('/related-articles', aiController.getRelatedArticles);

// Sentiment analysis
router.post('/analyze-sentiment', aiController.analyzeSentiment);

// Content suggestions
router.post('/suggest-content', aiController.suggestContent);

// Tag suggestions
router.post('/suggest-tags', aiController.suggestTags);

module.exports = router; 