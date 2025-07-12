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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm" data-section="0">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            (AI)DENTITY
          </h1>
          <h2 className="text-2xl text-gray-600 mb-2">
            Who Are We in the Age of Algorithms?
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            A personal journey through 59,542 voices and what they taught me about our relationship with artificial intelligence
          </p>
        </div>
      </header>

      {/* Personal Introduction */}
      <section className="max-w-4xl mx-auto px-4 py-16" data-section="1">
        <div className="prose prose-lg mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            I used to think I knew how people felt about AI. I was wrong.
          </h3>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Last year, I was at a dinner party when my friend Sarah, a teacher, mentioned she was using ChatGPT to help grade essays. "Isn't that cheating?" asked Mike, a software engineer who ironically uses AI coding assistants daily. Meanwhile, my grandmother had just learned to use voice assistants and was convinced they were "listening to everything."
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            That night, I realized something: we all have completely different relationships with AI, shaped by our backgrounds, fears, and hopes. Some of us embrace it, others resist it, and many of us exist somewhere in between, confused and conflicted.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            So I did what any data-obsessed person would do. I dove into research from 59,542 people across three continents who shared their deepest thoughts about artificial intelligence. What I found wasn't just data—it was a mirror reflecting our collective humanity in the age of algorithms.
          </p>

          <p className="text-xl font-semibold text-gray-800 text-center mt-8">
            This is their story. And maybe yours too.
          </p>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="w-full bg-gray-50 py-16" data-section="2">
        <div className="max-w-7xl mx-auto px-4">
          <DataVisualization />
        </div>
      </section>

      {/* Quiz Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-white" data-section="3">
        <QuizComponent onComplete={handleQuizComplete} userPersona={userPersona} />
      </section>

      {/* Results Section */}
      {userPersona && (
        <section className="max-w-4xl mx-auto px-4 py-16" data-section="4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                You are a {userPersona}
              </h3>
              <p className="text-5xl font-bold" style={{ color: PERSONA_DATA[userPersona].color }}>
                {PERSONA_DATA[userPersona].percentage}%
              </p>
              <p className="text-lg text-gray-600 mt-2">
                of people share your AI perspective ({PERSONA_DATA[userPersona].size.toLocaleString()} participants)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {PERSONA_DATA[userPersona].description}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Your Concern Profile</h4>
                <PersonaRadar persona={PERSONA_DATA[userPersona]} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Conclusion */}
      <section className="max-w-4xl mx-auto px-4 py-16" data-section="5">
        <div className="prose prose-lg mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Your voice matters in this conversation
          </h3>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Whether you're cautiously optimistic like most people, deeply concerned about cultural preservation, or focused on security and safety, your perspective adds to the rich tapestry of human responses to artificial intelligence.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The future of AI isn't just being written by technologists in Silicon Valley. It's being shaped by teachers worrying about their students, parents thinking about their children's future, artists concerned about creativity, and workers wondering about economic security.
          </p>

          <p className="text-xl font-semibold text-gray-800">
            It's being shaped by you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">
            Based on research analyzing 59,542 participants across three global regions
          </p>
          <p className="text-sm text-gray-400">
            Data visualization and analysis • Methodology available on GitHub
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;