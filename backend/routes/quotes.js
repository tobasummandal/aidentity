const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Get all quotes from CSV with metadata
router.get('/', async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../data/raw/all_thought_labels.csv');
    
    // Check if CSV file exists
    if (!fs.existsSync(csvPath)) {
      console.warn('CSV file not found, returning sample quotes');
      return res.json({
        quotes: getSampleQuotes(),
        source: 'sample',
        total: getSampleQuotes().length
      });
    }

    // Read and parse CSV
    const quotes = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Extract data from your CSV structure
        const responseText = row.ResponseText;
        const sentiment = row.Sentiment;
        const questionId = row['Question ID'];
        const participantId = row['Participant ID'];
        
        // Collect all tags (Tag 1 through Tag 13)
        const tags = [];
        for (let i = 1; i <= 13; i++) {
          const tag = row[`Tag ${i}`];
          if (tag && tag.trim()) {
            tags.push(tag.trim());
          }
        }
        
        if (responseText && responseText.trim().length > 10) {
          quotes.push({
            text: responseText.trim(),
            sentiment: sentiment || 'neutral',
            questionId: questionId,
            participantId: participantId,
            tags: tags,
            id: quotes.length + 1
          });
        }
      })
      .on('end', () => {
        console.log(`Loaded ${quotes.length} quotes from CSV`);
        res.json({
          quotes: quotes,
          source: 'csv',
          total: quotes.length,
          stats: getQuoteStats(quotes)
        });
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        res.json({
          quotes: getSampleQuotes(),
          source: 'fallback',
          error: error.message
        });
      });

  } catch (error) {
    console.error('Error processing quotes:', error);
    res.json({
      quotes: getSampleQuotes(),
      source: 'error_fallback',
      error: error.message
    });
  }
});

// Get random quotes with optional filtering
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const sentiment = req.query.sentiment; // Filter by sentiment
    const tag = req.query.tag; // Filter by tag
    
    const allQuotes = await getAllQuotes();
    let filteredQuotes = allQuotes;
    
    // Apply filters
    if (sentiment) {
      filteredQuotes = filteredQuotes.filter(q => 
        q.sentiment && q.sentiment.toLowerCase() === sentiment.toLowerCase()
      );
    }
    
    if (tag) {
      filteredQuotes = filteredQuotes.filter(q => 
        q.tags && q.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }
    
    // Shuffle and take requested number
    const shuffled = filteredQuotes.sort(() => 0.5 - Math.random());
    const selectedQuotes = shuffled.slice(0, count);
    
    res.json({
      quotes: selectedQuotes,
      total_available: allQuotes.length,
      filtered_available: filteredQuotes.length,
      requested: count,
      filters: { sentiment, tag }
    });
  } catch (error) {
    console.error('Error getting random quotes:', error);
    res.status(500).json({ error: 'Failed to fetch random quotes' });
  }
});

// Get quotes by sentiment
router.get('/sentiment/:sentiment', async (req, res) => {
  try {
    const sentiment = req.params.sentiment;
    const allQuotes = await getAllQuotes();
    
    const filteredQuotes = allQuotes.filter(q => 
      q.sentiment && q.sentiment.toLowerCase() === sentiment.toLowerCase()
    );
    
    res.json({
      quotes: filteredQuotes,
      sentiment: sentiment,
      total: filteredQuotes.length
    });
  } catch (error) {
    console.error('Error getting quotes by sentiment:', error);
    res.status(500).json({ error: 'Failed to fetch quotes by sentiment' });
  }
});

// Get quotes by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const tag = req.params.tag;
    const allQuotes = await getAllQuotes();
    
    const filteredQuotes = allQuotes.filter(q => 
      q.tags && q.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
    
    res.json({
      quotes: filteredQuotes,
      tag: tag,
      total: filteredQuotes.length
    });
  } catch (error) {
    console.error('Error getting quotes by tag:', error);
    res.status(500).json({ error: 'Failed to fetch quotes by tag' });
  }
});

// Get statistics about the quotes
router.get('/stats', async (req, res) => {
  try {
    const allQuotes = await getAllQuotes();
    const stats = getQuoteStats(allQuotes);
    
    res.json({
      total_quotes: allQuotes.length,
      stats: stats,
      source: allQuotes.length > 0 ? 'csv' : 'sample'
    });
  } catch (error) {
    console.error('Error getting quote stats:', error);
    res.status(500).json({ error: 'Failed to fetch quote statistics' });
  }
});

// Helper function to get all quotes
async function getAllQuotes() {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(__dirname, '../data/raw/all_thought_labels.csv');
    
    if (!fs.existsSync(csvPath)) {
      resolve(getSampleQuotes());
      return;
    }

    const quotes = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const responseText = row.ResponseText;
        const sentiment = row.Sentiment;
        const questionId = row['Question ID'];
        const participantId = row['Participant ID'];
        
        // Collect all tags
        const tags = [];
        for (let i = 1; i <= 13; i++) {
          const tag = row[`Tag ${i}`];
          if (tag && tag.trim()) {
            tags.push(tag.trim());
          }
        }
        
        if (responseText && responseText.trim().length > 10) {
          quotes.push({
            text: responseText.trim(),
            sentiment: sentiment || 'neutral',
            questionId: questionId,
            participantId: participantId,
            tags: tags,
            id: quotes.length + 1
          });
        }
      })
      .on('end', () => resolve(quotes))
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        resolve(getSampleQuotes());
      });
  });
}

// Generate statistics from quotes
function getQuoteStats(quotes) {
  if (!quotes || quotes.length === 0) {
    return { sentiments: {}, tags: {}, questions: {}, participants: 0 };
  }
  
  const sentiments = {};
  const tagCounts = {};
  const questionCounts = {};
  const uniqueParticipants = new Set();
  
  quotes.forEach(quote => {
    // Count sentiments
    if (quote.sentiment) {
      sentiments[quote.sentiment] = (sentiments[quote.sentiment] || 0) + 1;
    }
    
    // Count tags
    if (quote.tags) {
      quote.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
    
    // Count questions
    if (quote.questionId) {
      questionCounts[quote.questionId] = (questionCounts[quote.questionId] || 0) + 1;
    }
    
    // Count unique participants
    if (quote.participantId) {
      uniqueParticipants.add(quote.participantId);
    }
  });
  
  // Get top tags
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  
  return {
    sentiments,
    topTags,
    questionCounts,
    uniqueParticipants: uniqueParticipants.size,
    averageTagsPerQuote: quotes.reduce((sum, q) => sum + (q.tags?.length || 0), 0) / quotes.length
  };
}

// Fallback sample quotes with structure matching CSV
function getSampleQuotes() {
  return [
    {
      text: "AI will help us solve climate change faster than we could alone.",
      sentiment: "positive",
      questionId: "Q1",
      participantId: "P001",
      tags: ["environment", "optimism", "technology"],
      id: 1
    },
    {
      text: "I worry that AI will make human creativity obsolete.",
      sentiment: "negative",
      questionId: "Q2",
      participantId: "P002",
      tags: ["creativity", "concern", "replacement"],
      id: 2
    },
    {
      text: "Machine learning should be taught in elementary schools.",
      sentiment: "positive",
      questionId: "Q3",
      participantId: "P003",
      tags: ["education", "early-learning", "technology"],
      id: 3
    },
    {
      text: "AI assistants make me feel less lonely when I work from home.",
      sentiment: "positive",
      questionId: "Q4",
      participantId: "P004",
      tags: ["companionship", "remote-work", "emotional"],
      id: 4
    },
    {
      text: "We need global regulations for AI before it's too late.",
      sentiment: "neutral",
      questionId: "Q5",
      participantId: "P005",
      tags: ["regulation", "safety", "governance"],
      id: 5
    }
  ];
}

module.exports = router;
