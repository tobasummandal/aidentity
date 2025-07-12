const express = require('express');
const router = express.Router();
const { calculatePersona } = require('../utils/personaCalculator');

// Submit quiz and get persona result
router.post('/submit', (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ error: 'Invalid quiz answers' });
    }
    
    const persona = calculatePersona(answers);
    const timestamp = new Date().toISOString();
    
    // In a real app, you might save this to a database
    console.log(`Quiz completed at ${timestamp}, result: ${persona}`);
    
    res.json({
      persona,
      timestamp,
      confidence: 0.85 // Could be calculated based on answer patterns
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process quiz results' });
  }
});

module.exports = router;