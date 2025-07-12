import { PERSONA_DATA } from '../data/personaData';

export const calculatePersona = (answers) => {
  const scores = {
    "Balanced Social Participant": 0,
    "Consistent Social Responder": 0,
    "Balanced Security Participant": 0,
    "Cultural Preservationist": 0,
    "Technology-Aware Participant": 0
  };

  // Scoring algorithm based on answer patterns
  answers.forEach((answer, index) => {
    switch(index) {
      case 0: // Job displacement question
        if (answer === 0) scores["Balanced Social Participant"] += 2;
        if (answer === 1) scores["Technology-Aware Participant"] += 2;
        if (answer === 2) scores["Consistent Social Responder"] += 2;
        if (answer === 3) scores["Balanced Security Participant"] += 2;
        if (answer === 4) scores["Technology-Aware Participant"] += 1;
        break;
        
      case 1: // Privacy question
        if (answer === 0 || answer === 4) scores["Technology-Aware Participant"] += 2;
        if (answer === 1 || answer === 3) scores["Balanced Security Participant"] += 2;
        if (answer === 2) scores["Balanced Social Participant"] += 1;
        break;
        
      case 2: // Future vision question
        if (answer === 0) scores["Balanced Social Participant"] += 2;
        if (answer === 1) scores["Technology-Aware Participant"] += 1;
        if (answer === 2) scores["Consistent Social Responder"] += 2;
        if (answer === 3) scores["Cultural Preservationist"] += 2;
        if (answer === 4) scores["Technology-Aware Participant"] += 2;
        break;
        
      case 3: // Education question
        if (answer === 0) scores["Cultural Preservationist"] += 1;
        if (answer === 1) scores["Balanced Security Participant"] += 2;
        if (answer === 2) scores["Consistent Social Responder"] += 2;
        if (answer === 3) scores["Balanced Security Participant"] += 1;
        if (answer === 4) scores["Cultural Preservationist"] += 2;
        break;
        
      case 4: // AI mistakes question
        if (answer === 0 || answer === 4) scores["Technology-Aware Participant"] += 2;
        if (answer === 1) scores["Balanced Security Participant"] += 1;
        if (answer === 2) scores["Balanced Social Participant"] += 1;
        if (answer === 3) scores["Balanced Security Participant"] += 2;
        break;
    }
  });

  // Find the persona with the highest score
  const topPersona = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  );

  return topPersona[0];
};

export const getPersonaInsights = (personaName) => {
  const persona = PERSONA_DATA[personaName];
  return {
    ...persona,
    globalRanking: Object.keys(PERSONA_DATA).indexOf(personaName) + 1,
    isLargestGroup: persona.percentage > 50,
    isMajority: persona.percentage > 25
  };
};