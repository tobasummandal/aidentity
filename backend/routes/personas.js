const express = require('express');
const router = express.Router();
const personaData = require('../data/processed/personas.json');

// Get all personas
router.get('/', (req, res) => {
  try {
    res.json(personaData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persona data' });
  }
});

// Get specific persona
router.get('/:name', (req, res) => {
  try {
    const persona = personaData[req.params.name];
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persona' });
  }
});

module.exports = router;