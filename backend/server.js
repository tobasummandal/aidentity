const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const personasRouter = require('./routes/personas');
const quizRouter = require('./routes/quiz');
const quotesRouter = require('./routes/quotes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from data directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Routes
app.use('/api/personas', personasRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/quotes', quotesRouter);

// Health check with detailed info
app.get('/api/health', (req, res) => {
  const fs = require('fs');
  const csvPath = path.join(__dirname, 'data/raw/all_thought_labels.csv');
  const csvExists = fs.existsSync(csvPath);
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    csvFile: {
      exists: csvExists,
      path: csvExists ? 'backend/data/raw/all_thought_labels.csv' : 'NOT FOUND',
      message: csvExists ? 'CSV file loaded successfully' : 'CSV file not found - using sample data'
    },
    endpoints: {
      personas: [
        'GET /api/personas - Get all personas',
        'GET /api/personas/:name - Get specific persona'
      ],
      quiz: [
        'POST /api/quiz/submit - Submit quiz answers'
      ],
      quotes: [
        'GET /api/quotes - Get all quotes with metadata',
        'GET /api/quotes/random/:count - Get random quotes',
        'GET /api/quotes/sentiment/:sentiment - Filter by sentiment',
        'GET /api/quotes/tag/:tag - Filter by tag',
        'GET /api/quotes/stats - Get quote statistics'
      ],
      health: [
        'GET /api/health - System health check'
      ]
    }
  });
});

// CSV file check endpoint
app.get('/api/data-status', (req, res) => {
  const fs = require('fs');
  const csvPath = path.join(__dirname, 'data/raw/all_thought_labels.csv');
  
  try {
    if (fs.existsSync(csvPath)) {
      const stats = fs.statSync(csvPath);
      res.json({
        csvFile: {
          exists: true,
          path: 'backend/data/raw/all_thought_labels.csv',
          size: stats.size,
          modified: stats.mtime,
          message: 'CSV file found and ready to use'
        }
      });
    } else {
      res.json({
        csvFile: {
          exists: false,
          path: 'backend/data/raw/all_thought_labels.csv',
          message: 'CSV file not found. Place your all_thought_labels.csv file in backend/data/raw/ directory.',
          instructions: [
            '1. Create the directory: mkdir -p backend/data/raw',
            '2. Copy your CSV file: cp all_thought_labels.csv backend/data/raw/',
            '3. Restart the server: npm run dev'
          ]
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error checking CSV file',
      message: error.message
    });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    availableEndpoints: [
      '/api/health',
      '/api/data-status', 
      '/api/personas',
      '/api/quiz/submit',
      '/api/quotes',
      '/api/quotes/random/:count',
      '/api/quotes/sentiment/:sentiment',
      '/api/quotes/tag/:tag',
      '/api/quotes/stats'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Data status: http://localhost:${PORT}/api/data-status`);
  console.log('');
  console.log('📋 Available API endpoints:');
  console.log('   Personas:');
  console.log(`     GET  /api/personas`);
  console.log(`     GET  /api/personas/:name`);
  console.log('   Quiz:');
  console.log(`     POST /api/quiz/submit`);
  console.log('   Quotes:');
  console.log(`     GET  /api/quotes`);
  console.log(`     GET  /api/quotes/random/:count`);
  console.log(`     GET  /api/quotes/sentiment/:sentiment`);
  console.log(`     GET  /api/quotes/tag/:tag`);
  console.log(`     GET  /api/quotes/stats`);
  console.log('   System:');
  console.log(`     GET  /api/health`);
  console.log(`     GET  /api/data-status`);
  console.log('');
  
  // Check for CSV file on startup
  const fs = require('fs');
  const csvPath = path.join(__dirname, 'data/raw/all_thought_labels.csv');
  if (fs.existsSync(csvPath)) {
    console.log('✅ CSV file found: all_thought_labels.csv');
    console.log('📊 Real data will be used for quotes');
  } else {
    console.log('⚠️  CSV file not found: backend/data/raw/all_thought_labels.csv');
    console.log('📝 Sample data will be used as fallback');
    console.log('💡 Place your CSV file in backend/data/raw/ to use real data');
  }
  console.log('');
});
