const fs = require('fs-extra');
const path = require('path');

class PersonaCalculator {
  constructor() {
    this.personaData = null;
    this.loadPersonaData();
  }

  async loadPersonaData() {
    try {
      const dataPath = path.join(__dirname, '../data/processed/personas.json');
      this.personaData = await fs.readJson(dataPath);
    } catch (error) {
      console.warn('Could not load persona data, using defaults');
      this.personaData = this.getDefaultPersonaData();
    }
  }

  calculatePersona(answers) {
    if (!Array.isArray(answers) || answers.length !== 5) {
      throw new Error('Invalid answers format. Expected array of 5 integers.');
    }

    const scores = {
      "Balanced Social Participant": 0,
      "Consistent Social Responder": 0,
      "Balanced Security Participant": 0,
      "Cultural Preservationist": 0,
      "Technology-Aware Participant": 0
    };

    // Sophisticated scoring algorithm based on research patterns
    answers.forEach((answer, questionIndex) => {
      this.scoreQuestion(scores, questionIndex, answer);
    });

    // Find the persona with highest score
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topPersona = sortedScores[0][0];
    const confidence = this.calculateConfidence(scores, sortedScores[0][1]);

    return {
      persona: topPersona,
      confidence: confidence,
      scores: scores,
      alternativePersonas: sortedScores.slice(1, 3).map(([name, score]) => ({
        name,
        score,
        likelihood: (score / sortedScores[0][1] * 100).toFixed(1)
      }))
    };
  }

  scoreQuestion(scores, questionIndex, answer) {
    switch(questionIndex) {
      case 0: // Job displacement attitudes
        this.scoreJobDisplacement(scores, answer);
        break;
      case 1: // Privacy concerns
        this.scorePrivacyConcerns(scores, answer);
        break;
      case 2: // Future vision
        this.scoreFutureVision(scores, answer);
        break;
      case 3: // Education concerns
        this.scoreEducationConcerns(scores, answer);
        break;
      case 4: // AI mistakes handling
        this.scoreAIMistakes(scores, answer);
        break;
    }
  }

  scoreJobDisplacement(scores, answer) {
    const weights = {
      0: { "Balanced Social Participant": 3, "Technology-Aware Participant": 1 },
      1: { "Technology-Aware Participant": 3, "Consistent Social Responder": 1 },
      2: { "Consistent Social Responder": 3, "Cultural Preservationist": 1 },
      3: { "Balanced Security Participant": 3, "Cultural Preservationist": 2 },
      4: { "Technology-Aware Participant": 2, "Balanced Social Participant": 1 }
    };
    this.applyWeights(scores, weights[answer] || {});
  }

  scorePrivacyConcerns(scores, answer) {
    const weights = {
      0: { "Technology-Aware Participant": 3, "Balanced Social Participant": 1 },
      1: { "Balanced Security Participant": 3, "Technology-Aware Participant": 1 },
      2: { "Balanced Social Participant": 2, "Technology-Aware Participant": 1 },
      3: { "Balanced Security Participant": 3, "Cultural Preservationist": 1 },
      4: { "Technology-Aware Participant": 2, "Balanced Social Participant": 1 }
    };
    this.applyWeights(scores, weights[answer] || {});
  }

  scoreFutureVision(scores, answer) {
    const weights = {
      0: { "Balanced Social Participant": 3, "Technology-Aware Participant": 2 },
      1: { "Technology-Aware Participant": 2, "Consistent Social Responder": 1 },
      2: { "Consistent Social Responder": 3, "Balanced Security Participant": 1 },
      3: { "Cultural Preservationist": 3, "Balanced Security Participant": 2 },
      4: { "Technology-Aware Participant": 3, "Balanced Social Participant": 1 }
    };
    this.applyWeights(scores, weights[answer] || {});
  }

  scoreEducationConcerns(scores, answer) {
    const weights = {
      0: { "Cultural Preservationist": 2, "Balanced Social Participant": 1 },
      1: { "Balanced Security Participant": 3, "Technology-Aware Participant": 1 },
      2: { "Consistent Social Responder": 3, "Balanced Security Participant": 1 },
      3: { "Balanced Security Participant": 2, "Technology-Aware Participant": 2 },
      4: { "Cultural Preservationist": 3, "Balanced Social Participant": 1 }
    };
    this.applyWeights(scores, weights[answer] || {});
  }

  scoreAIMistakes(scores, answer) {
    const weights = {
      0: { "Technology-Aware Participant": 3, "Balanced Social Participant": 1 },
      1: { "Balanced Security Participant": 2, "Consistent Social Responder": 1 },
      2: { "Balanced Social Participant": 2, "Balanced Security Participant": 1 },
      3: { "Balanced Security Participant": 3, "Cultural Preservationist": 1 },
      4: { "Technology-Aware Participant": 2, "Balanced Social Participant": 1 }
    };
    this.applyWeights(scores, weights[answer] || {});
  }

  applyWeights(scores, weights) {
    Object.entries(weights).forEach(([persona, weight]) => {
      if (scores.hasOwnProperty(persona)) {
        scores[persona] += weight;
      }
    });
  }

  calculateConfidence(scores, topScore) {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (totalScore === 0) return 0.5; // Default confidence
    
    const confidence = topScore / totalScore;
    return Math.min(0.95, Math.max(0.3, confidence)); // Clamp between 30% and 95%
  }

  getPersonaDetails(personaName) {
    if (!this.personaData || !this.personaData[personaName]) {
      return this.getDefaultPersonaData()[personaName] || null;
    }
    return this.personaData[personaName];
  }

  getAllPersonas() {
    return this.personaData || this.getDefaultPersonaData();
  }

  getDefaultPersonaData() {
    return {
      "Balanced Social Participant": {
        size: 35344,
        percentage: 59.4,
        color: "#7994b5",
        description: "You approach AI with cautious optimism, recognizing both opportunities and risks. You value social connection and worry about technology isolating people, but you also see AI's potential to enhance human collaboration."
      },
      "Consistent Social Responder": {
        size: 13241,
        percentage: 22.2,
        color: "#93b778",
        description: "You engage thoughtfully with AI questions and show consistent concern patterns. Social isolation and maintaining human connections are your primary concerns as AI develops."
      },
      "Balanced Security Participant": {
        size: 2023,
        percentage: 3.4,
        color: "#d17c3f",
        description: "You prioritize safety and security in AI development. You want careful regulation and oversight to ensure AI systems are safe and beneficial for everyone."
      },
      "Cultural Preservationist": {
        size: 4987,
        percentage: 8.4,
        color: "#be7249",
        description: "You're concerned about AI's impact on cultural values and traditions. You want to ensure that technological progress doesn't erode the cultural foundations that give life meaning."
      },
      "Technology-Aware Participant": {
        size: 3947,
        percentage: 6.6,
        color: "#b63e36",
        description: "You understand technology dependence risks but remain engaged. You're aware of the potential pitfalls of AI while appreciating its capabilities."
      }
    };
  }

  generatePersonaReport(personaName, answers) {
    const persona = this.getPersonaDetails(personaName);
    if (!persona) return null;

    return {
      persona: {
        name: personaName,
        ...persona
      },
      userAnswers: answers,
      insights: this.generateInsights(personaName, answers),
      recommendations: this.generateRecommendations(personaName),
      similarUsers: this.getSimilarUsers(personaName)
    };
  }

  generateInsights(personaName, answers) {
    const insights = [];
    
    // Analyze answer patterns
    if (answers[1] >= 3) { // Privacy concern
      insights.push("You show significant concern about AI privacy and surveillance.");
    }
    
    if (answers[0] >= 3) { // Job displacement
      insights.push("Economic impacts of AI are a key concern for you.");
    }
    
    if (answers[3] === 4) { // Education - human mentorship
      insights.push("You highly value human guidance and mentorship in learning.");
    }

    return insights;
  }

  generateRecommendations(personaName) {
    const recommendations = {
      "Balanced Social Participant": [
        "Explore AI tools that enhance human collaboration",
        "Look for AI applications that strengthen social connections",
        "Stay informed about AI development through balanced sources"
      ],
      "Consistent Social Responder": [
        "Engage in discussions about AI ethics and social impact",
        "Support organizations working on inclusive AI development",
        "Consider how AI can address social justice issues"
      ],
      "Balanced Security Participant": [
        "Follow AI regulation and policy developments",
        "Learn about AI safety and security measures",
        "Support transparent AI development practices"
      ],
      "Cultural Preservationist": [
        "Explore how AI can help preserve cultural heritage",
        "Connect with others who share cultural preservation values",
        "Advocate for diverse perspectives in AI development"
      ],
      "Technology-Aware Participant": [
        "Stay updated on AI research and developments",
        "Explore advanced AI applications in your field",
        "Share knowledge about AI benefits and risks"
      ]
    };

    return recommendations[personaName] || [];
  }

  getSimilarUsers(personaName) {
    const persona = this.getPersonaDetails(personaName);
    if (!persona) return {};

    return {
      globalCount: persona.size,
      percentage: persona.percentage,
      regionalDistribution: persona.regionalDistribution || {}
    };
  }
}