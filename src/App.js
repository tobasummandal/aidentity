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
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [titleAnimated, setTitleAnimated] = useState(false);

  // Intersection Observer for scroll sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = parseInt(entry.target.dataset.section);
            setCurrentSection(section);
            setVisibleSections(prev => new Set([...prev, section]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    // Title animation trigger
    const titleTimer = setTimeout(() => setTitleAnimated(true), 500);

    return () => {
      observer.disconnect();
      clearTimeout(titleTimer);
    };
  }, []);

  const handleQuizComplete = (answers) => {
    const persona = calculatePersona(answers);
    setQuizResults(answers);
    setUserPersona(persona);
  };

  const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (!hasStarted) return;
      
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const currentCount = Math.floor(progress * end);
        
        setCount(currentCount);
        
        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [hasStarted, end, duration]);

    useEffect(() => {
      const timer = setTimeout(() => setHasStarted(true), 500);
      return () => clearTimeout(timer);
    }, []);

    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 font-sans">
      {/* Header */}
      <header className="relative h-screen flex items-center justify-center text-center px-4" data-section="0">
        <div className="max-w-4xl">
          <h1 className={`text-6xl md:text-8xl font-black text-gray-800 mb-4 tracking-tight transition-all duration-1000 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            (AI)DENTITY
          </h1>
          <h2 className={`text-2xl md:text-3xl text-gray-600 mb-8 font-light transition-all duration-1000 delay-300 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            Who Are We in the Age of Algorithms?
          </h2>
          <p className={`text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            A personal journey through <AnimatedCounter end={59542} /> voices and what they taught me about our relationship with artificial intelligence
          </p>
          <p className={`text-md text-gray-400 mt-4 transition-all duration-1000 delay-700 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            by Sarena Yousuf, Şefika Öztürk and Tobasum Mandal
          </p>
        </div>
      </header>

      {/* Personal Introduction */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16" data-section="1">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <p className={`text-2xl font-light mb-8 text-gray-800 transition-all duration-1000 ${visibleSections.has(1) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            I used to think I knew how people felt about AI. I was wrong.
          </p>
          
          <p className={`mb-6 transition-all duration-1000 delay-200 ${visibleSections.has(1) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            Last year, during my very first new media art class in college, my professor told us we could use AI for our final projects, as long as we wrote a reflection on how our interaction with ChatGPT helped us. He even mentioned that he was using AI to help with his personal work. "Isn't that cheating?" I asked timidly during his office hours. He shared that he believes it's just a tool, and as long as the artist's intention is achieved, it's no different to him than using a camera. Meanwhile, my aunt in Kashmir had just gotten a new phone so she could use voice assistants, but she was convinced she was being watched by the military.
          </p>

          <p className={`mb-6 transition-all duration-1000 delay-300 ${visibleSections.has(1) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'}`}>
            That night, I realized something: we all have completely different relationships with AI, shaped by our backgrounds, fears, desires, sins and hopes. Some of us embrace it, others resist it, and many of us exist somewhere in between, confused and conflicted.
          </p>

          <p className={`mb-6 transition-all duration-1000 delay-500 ${visibleSections.has(1) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            I spent the next year in computer science, film and art classes where my projects became an attempt to answer why different people in my college—and in my own family—interact with AI so differently. I was trying to define my own boundaries and fascinations around AI in my life. So when my friends shared that we could access research data about this, we dove into findings from <AnimatedCounter end={59542} /> people across three continents who had shared their deepest thoughts about artificial intelligence. What we found wasn't just data—it was like looking into a mirror that reflected all of our messy, complicated feelings about living with algorithms.
          </p>

          <p className={`text-xl font-medium text-gray-800 mt-12 transition-all duration-1000 delay-700 ${visibleSections.has(1) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            This is their story. And maybe yours too.
          </p>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="w-full bg-gray-50 py-16" data-section="2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(2) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <AnimatedCounter end={59542} /> voices became 5 human stories
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visibleSections.has(2) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              When we analyzed how people really think about AI, clear patterns emerged. Not stereotypes or simple categories, but genuine human perspectives shaped by individual desires, shame, guilt and hopes. In many ways, I found humanity hidden in the data about AI.
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-500 ${visibleSections.has(2) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            <DataVisualization />
          </div>
        </div>
      </section>

      {/* Personal Stories within Data */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16" data-section="3">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <h2 className={`text-4xl font-bold text-gray-800 mb-8 text-center transition-all duration-1000 ${visibleSections.has(3) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            The stories behind the statistics
          </h2>
          
          <div className={`bg-blue-50 p-8 rounded-2xl mb-8 hover:bg-blue-100 transition-colors duration-300 ${visibleSections.has(3) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'} transition-all duration-1000 delay-200`}>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Balanced Social Participant (<AnimatedCounter end={59.4} suffix="%" />)</h3>
            <p className="mb-4">
              Meet Maria, a representative voice from this largest group. She's a working mother in her 30s who uses AI tools for work efficiency but worries about her children losing face-to-face social skills. She represents the majority of us—cautiously optimistic but deeply concerned about maintaining human connection.
            </p>
            <p className="text-blue-700 italic">
              "I want AI to help us, not replace what makes us human."
            </p>
          </div>

          <div className={`bg-green-50 p-8 rounded-2xl mb-8 hover:bg-green-100 transition-colors duration-300 ${visibleSections.has(3) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'} transition-all duration-1000 delay-500`}>
            <h3 className="text-2xl font-semibold text-green-800 mb-4">The Consistent Social Responder (<AnimatedCounter end={22.2} suffix="%" />)</h3>
            <p className="mb-4">
              Think of David, a community organizer who sees AI through the lens of social justice. He worries about algorithmic bias and economic inequality, but engages thoughtfully with AI development rather than rejecting it outright.
            </p>
            <p className="text-green-700 italic">
              "Technology should bring us together, not drive us apart."
            </p>
          </div>

          <div className={`bg-orange-50 p-8 rounded-2xl mb-8 hover:bg-orange-100 transition-colors duration-300 ${visibleSections.has(3) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'} transition-all duration-1000 delay-700`}>
            <h3 className="text-2xl font-semibold text-orange-800 mb-4">The Cultural Preservationist (<AnimatedCounter end={8.4} suffix="%" />)</h3>
            <p className="mb-4">
              Like Amara, who comes from a traditional family and worries that AI will erode cultural practices passed down through generations. She's not anti-technology, but she wants to ensure progress doesn't come at the cost of cultural identity.
            </p>
            <p className="text-orange-700 italic">
              "We can embrace the future without forgetting who we are."
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-white" data-section="4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(4) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              Where do you fit in this story?
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visibleSections.has(4) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              Take our research-based quiz to discover which of the five AI personas best represents your perspective. Your answers will be compared against patterns from <AnimatedCounter end={59542} /> global participants.
            </p>
          </div>
          <QuizComponent onComplete={handleQuizComplete} userPersona={userPersona} />
        </div>
      </section>

      {/* Results Section */}
      {userPersona && (
        <section className="max-w-4xl mx-auto px-4 py-16" data-section="5">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                You are a {userPersona}
              </h3>
              <p className="text-5xl font-bold mb-2" style={{ color: PERSONA_DATA[userPersona].color }}>
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
      <section className="max-w-4xl mx-auto px-4 py-16" data-section="6">
        <div className="prose prose-lg mx-auto text-center">
          <h3 className={`text-3xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(6) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            Your voice matters in this conversation
          </h3>
          
          <p className={`text-gray-700 leading-relaxed mb-6 transition-all duration-1000 delay-300 ${visibleSections.has(6) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            Whether you're cautiously optimistic like most people, deeply concerned about cultural preservation, or focused on security and safety, your perspective adds to the rich tapestry of human responses to artificial intelligence.
          </p>

          <p className={`text-gray-700 leading-relaxed mb-6 transition-all duration-1000 delay-500 ${visibleSections.has(6) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'}`}>
            The future of AI isn't just being written by technologists in Silicon Valley. It's being shaped by students dreaming about jobs that didn't exist a year ago, parents thinking about their children's future, artists experimenting without any limits to their creativity, aunts worrying about their grandchildren's privacy, and so many more.
          </p>

          <p className={`text-xl font-semibold text-gray-800 transition-all duration-1000 delay-700 ${visibleSections.has(6) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            It's being shaped by you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">
            Based on research analyzing <AnimatedCounter end={59542} /> participants across three global regions
          </p>
          <p className="text-sm text-gray-400">
            <a 
              href="https://github.com/tobasummandal/aidentity" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 underline"
            >
              Source code available on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
