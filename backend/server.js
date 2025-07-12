
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const personasRouter = require('./routes/personas');
const quizRouter = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/personas', personasRouter);
app.use('/api/quiz', quizRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
