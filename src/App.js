```json
import React, { useState, useEffect } from 'react';
import { PersonaRadar } from './components/PersonaRadar';
import { QuizComponent } from './components/QuizComponent';
import { DataVisualization } from './components/DataVisualization';
import { PERSONA_DATA } from './data/personaData';
import { calculatePersona } from './utils/calculations';

const App = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizResults, setQuizResults] = useState(null);
  const [userPersona, setUserPersona] = useState(null);

  // Intersection Observer for scroll sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = parseInt(entry.target.dataset.section);
            setCurrentSection(section);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleQuizComplete = (answers) => {
    const persona = calculatePersona(answers);
    setQuizResults(answers);
    setUserPersona(persona);
  };

  return (
    
      {/* Header */}
      
        
          
            (AI)DENTITY
          
          
            Who Are We in the Age of Algorithms?
          
          
            A personal journey through 59,542 voices and what they taught me about our relationship with artificial intelligence
          
        
      

      {/* Personal Introduction */}
      
        
          
            I used to think I knew how people felt about AI. I was wrong.
          
          
          
            Last year, I was at a dinner party when my friend Sarah, a teacher, mentioned she was using ChatGPT to help grade essays. "Isn't that cheating?" asked Mike, a software engineer who ironically uses AI coding assistants daily. Meanwhile, my grandmother had just learned to use voice assistants and was convinced they were "listening to everything."
          

          
            That night, I realized something: we all have completely different relationships with AI, shaped by our backgrounds, fears, and hopes. Some of us embrace it, others resist it, and many of us exist somewhere in between, confused and conflicted.
          

          
            So I did what any data-obsessed person would do. I dove into research from 59,542 people across three continents who shared their deepest thoughts about artificial intelligence. What I found wasn't just data—it was a mirror reflecting our collective humanity in the age of algorithms.
          

          
            This is their story. And maybe yours too.
          
        
      

      {/* Data Visualization Section */}
      
        
      

      {/* Quiz Section */}
      
        
      

      {/* Results Section */}
      {userPersona && (
        
          
            
              
                
                  You are a {userPersona}
                
                
                  {PERSONA_DATA[userPersona].percentage}%
                
                
                  of people share your AI perspective ({PERSONA_DATA[userPersona].size.toLocaleString()} participants)
                
              

              
                
                  
                    {PERSONA_DATA[userPersona].description}
                  
                
                
                  Your Concern Profile
                  
                
              
            
          
        
      )}

      {/* Conclusion */}
      
        
          
            Your voice matters in this conversation
          
          
          
            Whether you're cautiously optimistic like most people, deeply concerned about cultural preservation, or focused on security and safety, your perspective adds to the rich tapestry of human responses to artificial intelligence.
          

          
            The future of AI isn't just being written by technologists in Silicon Valley. It's being shaped by teachers worrying about their students, parents thinking about their children's future, artists concerned about creativity, and workers wondering about economic security.
          

          
            It's being shaped by you.
          
        
      

      {/* Footer */}
      
        
          
            Based on research analyzing 59,542 participants across three global regions
          
          
            Data visualization and analysis • Methodology available on GitHub
          
        
      
    
  );
};

export default App;
```