import React, { useState, useEffect } from 'react';
import { PersonaRadar } from './components/PersonaRadar';
import { QuizComponent } from './components/QuizComponent';
import { DataVisualization } from './components/DataVisualization';
import { SlotMachine } from './components/SlotMachine';
import { DataInsights } from './components/DataInsights';
import { PERSONA_DATA } from './data/personaData';
import { REGIONAL_DATA } from './data/researchData';
import { calculatePersona } from './utils/calculations';

const App = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizResults, setQuizResults] = useState(null);
  const [userPersona, setUserPersona] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [titleAnimated, setTitleAnimated] = useState(false);

  // Research data
  const RESEARCH_DATA = {
    personas: [
      { 
        name: "Balanced\nSocial", 
        percentage: 59.4, 
        participants: 35344,
        color: "#7994b5",
        description: "Cautiously optimistic about AI"
      },
      { 
        name: "Consistent\nSocial", 
        percentage: 22.2, 
        participants: 13241,
        color: "#93b778",
        description: "Thoughtful social justice focus"
      },
      { 
        name: "Cultural\nPreservationist", 
        percentage: 8.4, 
        participants: 4987,
        color: "#be7249",
        description: "Concerned about traditions"
      },
      { 
        name: "Technology\nAware", 
        percentage: 6.6, 
        participants: 3947,
        color: "#b63e36",
        description: "Understanding of risks"
      },
      { 
        name: "Security\nFocused", 
        percentage: 3.4, 
        participants: 2023,
        color: "#d17c3f",
        description: "Safety-first approach"
      }
    ]
  };

  // Intersection Observer for scroll sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = parseFloat(entry.target.dataset.section);
            setCurrentSection(section);
            setVisibleSections(prev => new Set([...prev, section]));
            
            // Add chart animation class when section becomes visible
            const charts = entry.target.querySelectorAll('.chart-animate');
            charts.forEach((chart, index) => {
              setTimeout(() => {
                chart.classList.add('visible');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    // Title animation trigger
    const titleTimer = setTimeout(() => setTitleAnimated(true), 500);

    // Add scroll progress indicator
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      let progressBar = document.getElementById('scroll-progress');
      if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: ${progress}%;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          z-index: 9999;
          transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);
      } else {
        progressBar.style.width = `${progress}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(titleTimer);
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) progressBar.remove();
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

  // Enhanced interactive visualization components
  const ResearchBasedPersonaChart = () => {
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [hoveredPersona, setHoveredPersona] = useState(null);

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          How Humanity Relates to AI: Research Findings
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Based on psychological analysis of 59,542 voices, five distinct ways of relating to AI emerged.
          <br />
          <span className="text-sm text-blue-600">Hover for details • Click bars for persona profiles</span>
        </p>
        
        {/* Interactive Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          {RESEARCH_DATA.personas.map((persona, index) => (
            <div 
              key={index} 
              className={`text-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedPersona === index ? 'ring-2 ring-blue-400' : ''
              }`}
              style={{ backgroundColor: `${persona.color}20` }}
              onClick={() => setSelectedPersona(selectedPersona === index ? null : index)}
              onMouseEnter={() => setHoveredPersona(index)}
              onMouseLeave={() => setHoveredPersona(null)}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: persona.color }}>
                <AnimatedCounter end={persona.percentage} suffix="%" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">
                {persona.name.replace('\n', ' ')}
              </div>
              <div className="text-gray-600 text-xs mt-1">{persona.participants.toLocaleString()} people</div>
              <div className="text-xs text-gray-500 mt-2 italic">"{persona.description}"</div>
            </div>
          ))}
        </div>
        
        {/* Selected Persona Details */}
        {selectedPersona !== null && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border-l-4 animate-fade-in-up" 
               style={{ borderColor: RESEARCH_DATA.personas[selectedPersona].color }}>
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold" style={{ color: RESEARCH_DATA.personas[selectedPersona].color }}>
                {RESEARCH_DATA.personas[selectedPersona].name.replace('\n', ' ')} Profile
              </h4>
              <button 
                onClick={() => setSelectedPersona(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Population:</strong> {RESEARCH_DATA.personas[selectedPersona].participants.toLocaleString()} people 
                  ({RESEARCH_DATA.personas[selectedPersona].percentage}%)
                </p>
                <p className="text-gray-600 italic">
                  "{RESEARCH_DATA.personas[selectedPersona].description}"
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: RESEARCH_DATA.personas[selectedPersona].color }}>
                    <AnimatedCounter end={RESEARCH_DATA.personas[selectedPersona].percentage} suffix="%" />
                  </div>
                  <div className="text-sm text-gray-500">of global population</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RegionalAnalysisChart = () => {
    const [selectedRegion, setSelectedRegion] = useState(null);

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Global AI Concern Patterns by Region
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Regional differences in AI fears reveal cultural and economic influences on technology perspectives.
        </p>
        
        {/* Regional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {REGIONAL_DATA.map((region, index) => (
            <div 
              key={index} 
              className={`bg-gray-50 p-6 rounded-lg text-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRegion === region.region ? 'ring-2 ring-blue-400 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
            >
              <div className="font-bold text-xl text-gray-800 mb-2">{region.region}</div>
              <div className="text-gray-600 mb-2">{region.participants.toLocaleString()} participants</div>
              <div className="text-sm text-gray-500 mb-4">{region.description}</div>
              
              {/* Fear Metrics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Economic:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(region.economic / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold">{region.economic}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(region.social / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold">{region.social}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cultural:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(region.cultural / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold">{region.cultural}/5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 font-sans">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .chart-animate {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }
        
        .chart-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        
        .opacity-0 { opacity: 0; }
      `}</style>

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

      {/* The Five Personas Discovery */}
      <section data-section="2" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(2) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <AnimatedCounter end={59542} /> voices became 5 human stories
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${visibleSections.has(2) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              When we analyzed how people really think about AI, clear patterns emerged. Not stereotypes or simple categories, but genuine human perspectives shaped by individual desires, shame, guilt and hopes. In many ways, I found humanity hidden in the data about AI. 
            </p>
          </div>

          <div className={`chart-animate ${visibleSections.has(2) ? 'animate-slide-in-left delay-500' : 'opacity-0'}`}>
            <ResearchBasedPersonaChart />
          </div>
        </div>
      </section>

      {/* Regional Differences */}
      <section data-section="3" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(3) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Geography shapes how we see AI
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 ${visibleSections.has(3) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Where you live influences your relationship with artificial intelligence. Cultural values, economic systems, and social structures all play a role in shaping our AI perspectives.
            </p>
          </div>

          <div className={`chart-animate ${visibleSections.has(3) ? 'animate-slide-in-right delay-500' : 'opacity-0'}`}>
            <RegionalAnalysisChart />
          </div>

          <div className={`mt-8 prose prose-lg text-gray-700 max-w-4xl mx-auto ${visibleSections.has(3) ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
            <p className="text-center">
              Asia-Pacific participants showed the highest concerns about social isolation, perhaps reflecting collectivist cultural values where community bonds are paramount. North Americans worried most about economic displacement, while Europeans demonstrated more balanced concern across all areas.
            </p>
          </div>
        </div>
      </section>

      {/* Data Insights from CSV */}
      <section data-section="3.5" className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(3.5) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              What the voices tell us
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 ${visibleSections.has(3.5) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Behind every data point is a human story. Here's what emerges when we analyze the sentiment and themes in thousands of individual responses about AI.
            </p>
          </div>

          <div className={`chart-animate ${visibleSections.has(3.5) ? 'animate-slide-in-left delay-500' : 'opacity-0'}`}>
            <DataInsights />
          </div>
        </div>
      </section>

      {/* Personal Stories within Data */}
      <section data-section="4" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <h2 className={`text-4xl font-bold text-gray-800 mb-8 text-center ${visibleSections.has(4) ? 'animate-fade-in-up' : 'opacity-0'}`}>
            The stories behind the statistics
          </h2>
          
          <div className={`bg-blue-50 p-8 rounded-2xl mb-8 hover:bg-blue-100 transition-colors duration-300 ${visibleSections.has(4) ? 'animate-slide-in-left delay-200' : 'opacity-0'}`}>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Balanced Social Participant (<AnimatedCounter end={59.4} suffix="%" />)</h3>
            <p className="mb-4">
              Meet Maria, a representative voice from this largest group. She's a working mother in her 30s who uses AI tools for work efficiency but worries about her children losing face-to-face social skills. She represents the majority of us—cautiously optimistic but deeply concerned about maintaining human connection.
            </p>
            <p className="text-blue-700 italic">
              "I want AI to help us, not replace what makes us human."
            </p>
          </div>

          <div className={`bg-green-50 p-8 rounded-2xl mb-8 hover:bg-green-100 transition-colors duration-300 ${visibleSections.has(4) ? 'animate-slide-in-right delay-500' : 'opacity-0'}`}>
            <h3 className="text-2xl font-semibold text-green-800 mb-4">The Consistent Social Responder (<AnimatedCounter end={22.2} suffix="%" />)</h3>
            <p className="mb-4">
              Think of David, a community organizer who sees AI through the lens of social justice. He worries about algorithmic bias and economic inequality, but engages thoughtfully with AI development rather than rejecting it outright.
            </p>
            <p className="text-green-700 italic">
              "Technology should bring us together, not drive us apart."
            </p>
          </div>

          <div className={`bg-orange-50 p-8 rounded-2xl mb-8 hover:bg-orange-100 transition-colors duration-300 ${visibleSections.has(4) ? 'animate-slide-in-left delay-700' : 'opacity-0'}`}>
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
      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-white" data-section="5">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(5) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              Where do you fit in this story?
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visibleSections.has(5) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              Take our research-based quiz to discover which of the five AI personas best represents your perspective. Your answers will be compared against patterns from <AnimatedCounter end={59542} /> global participants.
            </p>
          </div>
          <QuizComponent onComplete={handleQuizComplete} userPersona={userPersona} />
        </div>
      </section>

      {/* Interactive Slot Machine */}
      <section data-section="6" className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(6) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Voices from the Global Conversation
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 ${visibleSections.has(6) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Spin to discover real thoughts from our <AnimatedCounter end={59542} /> participants. 
              Each quote represents a genuine perspective on AI from someone, somewhere in the world.
            </p>
          </div>

          <div className={`${visibleSections.has(6) ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
            <SlotMachine />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {userPersona && (
        <section className="max-w-4xl mx-auto px-4 py-16" data-section="7">
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
      <section className="max-w-4xl mx-auto px-4 py-16" data-section="8">
        <div className="prose prose-lg mx-auto text-center">
          <h3 className={`text-3xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(8) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            Your voice matters in this conversation
          </h3>
          
          <p className={`text-gray-700 leading-relaxed mb-6 transition-all duration-1000 delay-300 ${visibleSections.has(8) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            Whether you're cautiously optimistic like most people, deeply concerned about cultural preservation, or focused on security and safety, your perspective adds to the rich tapestry of human responses to artificial intelligence.
          </p>

          <p className={`text-gray-700 leading-relaxed mb-6 transition-all duration-1000 delay-500 ${visibleSections.has(8) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'}`}>
            The future of AI isn't just being written by technologists in Silicon Valley. It's being shaped by students dreaming about jobs that didn't exist a year ago, parents thinking about their children's future, artists experimenting without any limits to their creativity, aunts worrying about their grandchildren's privacy, and so many more.
          </p>

          <p className={`text-xl font-semibold text-gray-800 transition-all duration-1000 delay-700 ${visibleSections.has(8) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
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
