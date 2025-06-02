const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const lunr = require('lunr');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Load and index KB documents
let searchIndex;
let documents = [];

async function loadAndIndexDocuments() {
  try {
    const docsDir = path.join(__dirname, 'kb-docs');
    const files = await fs.readdir(docsDir);
    
    documents = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const content = await fs.readFile(path.join(docsDir, file), 'utf8');
          const html = marked(content);
          return {
            articleId: path.basename(file, '.md'),
            title: content.split('\n')[0].replace('# ', ''),
            content: content,
            html: html,
            url: `/kb-docs/${file}`
          };
        })
    );
    
    // Create search index
    searchIndex = lunr(function() {
      this.field('title');
      this.field('content');
      this.ref('articleId');
      
      documents.forEach(doc => {
        this.add({
          articleId: doc.articleId,
          title: doc.title,
          content: doc.content
        });
      });
    });
  } catch (error) {
    console.error('Error loading KB documents:', error);
    documents = [];
    searchIndex = null;
  }
}

// Initialize KB
loadAndIndexDocuments();

// GET /search
app.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query || !searchIndex) {
    return res.json([]);
  }
  
  try {
    const results = searchIndex.search(query);
    const topResults = results
      .slice(0, 3)
      .map(result => {
        const doc = documents.find(d => d.articleId === result.ref);
        return {
          articleId: doc.articleId,
          title: doc.title,
          snippet: doc.content.substring(0, 200) + '...',
          url: doc.url
        };
      });
    
    res.json(topResults);
  } catch (error) {
    console.error('Search error:', error);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`KB service running on port ${PORT}`);
}); 