import React, { useState, useEffect, useRef } from 'react';
import { PersonaRadar } from './components/PersonaRadar';
import { QuizComponent } from './components/QuizComponent';
import { DataVisualization } from './components/DataVisualization';
import { PERSONA_DATA } from './data/personaData';
import { calculatePersona } from './utils/calculations';

const App = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [userPersona, setUserPersona] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [titleAnimated, setTitleAnimated] = useState(false);
  const observerRef = useRef();

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
    setQuizAnswers(answers);
    setUserPersona(persona);
  };

  const nextQuizStep = (answerIndex) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);
    
    if (quizStep < 4) { // 5 questions total (0-4)
      setQuizStep(quizStep + 1);
    } else {
      const persona = calculatePersona(newAnswers);
      setUserPersona(persona);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setUserPersona(null);
    setQuizStep(0);
    setQuizAnswers([]);
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

  const QUIZ_QUESTIONS = [
    {
      question: "When you see news about AI taking jobs, your first thought is:",
      options: [
        "This could free people to do more meaningful work",
        "We need better retraining programs for displaced workers", 
        "This will increase inequality and social division",
        "We should slow down AI development until we figure this out",
        "People will adapt like they always have to new technology"
      ]
    },
    {
      question: "How do you feel about AI systems knowing your daily habits?",
      options: [
        "It's fine if it makes services more helpful",
        "I'm worried about who else might access this data",
        "It makes me uncomfortable but I accept it for convenience",
        "I actively try to limit what AI systems know about me",
        "I think the benefits outweigh privacy concerns"
      ]
    },
    {
      question: "When you imagine AI in 20 years, you see:",
      options: [
        "A world where humans and AI collaborate seamlessly",
        "Significant social upheaval but eventual adaptation",
        "A divided society between AI-haves and have-nots",
        "Careful regulation ensuring AI serves human values",
        "Revolutionary changes in how we live and work"
      ]
    },
    {
      question: "Your biggest concern about AI in education is:",
      options: [
        "Students losing the ability to think critically",
        "Increased surveillance of learning behaviors",
        "Widening gaps between privileged and underprivileged students",
        "AI making wrong decisions about students' futures",
        "Loss of human mentorship and guidance"
      ]
    },
    {
      question: "When AI makes a mistake that affects you, you think:",
      options: [
        "It's a learning opportunity to improve the system",
        "Someone should be held accountable for AI decisions",
        "This shows why we need human oversight",
        "We need stronger safety testing before deployment",
        "Mistakes are inevitable with any new technology"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 font-sans">
      {/* Header */}
      <header className="relative h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className={`text-6xl md:text-8xl font-black text-gray-800 mb-4 tracking-tight transition-all duration-2000 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            (AI)DENTITY
          </h1>
          <p className={`text-2xl md:text-3xl text-gray-600 mb-8 font-light transition-all duration-1000 delay-300 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            Who Are We in the Age of Algorithms?
          </p>
          <p className={`text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            A personal journey through <AnimatedCounter end={59542} /> voices and what they taught me about our relationship with artificial intelligence
          </p>
          <p className={`text-md text-gray-400 mt-4 transition-all duration-1000 delay-700 ${titleAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            by Sarena Yousuf, Şefika Öztürk and Tobasum Mandal
          </p>
        </div>
      </header>

      {/* Personal Introduction */}
      <section data-section="0" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <p className={`text-2xl font-light mb-8 text-gray-800 transition-all duration-1000 ${visibleSections.has(0) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            I used to think I knew how people felt about AI. I was wrong.
          </p>
          
          <p className={`mb-6 transition-all duration-1000 delay-200 ${visibleSections.has(0) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            Last year, during my very first new media art class in college, my professor told us we could use AI for our final projects, as long as we wrote a reflection on how our interaction with ChatGPT helped us. He even mentioned that he was using AI to help with his personal work. "Isn't that cheating?" I asked timidly during his office hours. He shared that he believes it's just a tool, and as long as the artist's intention is achieved, it's no different to him than using a camera. Meanwhile, my aunt in Kashmir had just gotten a new phone so she could use voice assistants, but she was convinced she was being watched by the military.
          </p>

          <p className={`mb-6 transition-all duration-1000 delay-300 ${visibleSections.has(0) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'}`}>
            That night, I realized something: we all have completely different relationships with AI, shaped by our backgrounds, fears, desires, sins and hopes. Some of us embrace it, others resist it, and many of us exist somewhere in between, confused and conflicted.
          </p>

          <p className={`mb-6 transition-all duration-1000 delay-500 ${visibleSections.has(0) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            I spent the next year in computer science, film and art classes where my projects became an attempt to answer why different people in my college—and in my own family—interact with AI so differently. I was trying to define my own boundaries and fascinations around AI in my life. So when my friends shared that we could access research data about this, we dove into findings from <AnimatedCounter end={59542} /> people across three continents who had shared their deepest thoughts about artificial intelligence. What we found wasn't just data—it was like looking into a mirror that reflected all of our messy, complicated feelings about living with algorithms.
          </p>

          <p className={`text-xl font-medium text-gray-800 mt-12 transition-all duration-1000 delay-700 ${visibleSections.has(0) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            This is their story. And maybe yours too.
          </p>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section data-section="1" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(1) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <AnimatedCounter end={59542} /> voices became 5 human stories
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visibleSections.has(1) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              When we analyzed how people really think about AI, clear patterns emerged. Not stereotypes or simple categories, but genuine human perspectives shaped by individual desires, shame, guilt and hopes. In many ways, I found humanity hidden in the data about AI.
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${visibleSections.has(1) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            <DataVisualization />
          </div>
        </div>
      </section>

      {/* Personal Stories within Data */}
      <section data-section="2" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <h2 className={`text-4xl font-bold text-gray-800 mb-8 text-center transition-all duration-1000 ${visibleSections.has(2) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            The stories behind the statistics
          </h2>
          
          <div className={`bg-blue-50 p-8 rounded-2xl mb-8 hover:bg-blue-100 transition-colors duration-300 ${visibleSections.has(2) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'} transition-all duration-1000 delay-200`}>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Balanced Social Participant (<AnimatedCounter end={59.4} suffix="%" />)</h3>
            <p className="mb-4">
              Meet Maria, a representative voice from this largest group. She's a working mother in her 30s who uses AI tools for work efficiency but worries about her children losing face-to-face social skills. She represents the majority of us—cautiously optimistic but deeply concerned about maintaining human connection.
            </p>
            <p className="text-blue-700 italic">
              "I want AI to help us, not replace what makes us human."
            </p>
          </div>

          <div className={`bg-green-50 p-8 rounded-2xl mb-8 hover:bg-green-100 transition-colors duration-300 ${visibleSections.has(2) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'} transition-all duration-1000 delay-500`}>
            <h3 className="text-2xl font-semibold text-green-800 mb-4">The Consistent Social Responder (<AnimatedCounter end={22.2} suffix="%" />)</h3>
            <p className="mb-4">
              Think of David, a community organizer who sees AI through the lens of social justice. He worries about algorithmic bias and economic inequality, but engages thoughtfully with AI development rather than rejecting it outright.
            </p>
            <p className="text-green-700 italic">
              "Technology should bring us together, not drive us apart."
            </p>
          </div>

          <div className={`bg-orange-50 p-8 rounded-2xl mb-8 hover:bg-orange-100 transition-colors duration-300 ${visibleSections.has(2) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'} transition-all duration-1000 delay-700`}>
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

      {/* Interactive Quiz Section */}
      <section data-section="3" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${visibleSections.has(3) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              Where do you fit in this story?
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visibleSections.has(3) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              Take our research-based quiz to discover which of the five AI personas best represents your perspective. Your answers will be compared against patterns from <AnimatedCounter end={59542} /> global participants.
            </p>
          </div>

          {!showQuiz && !userPersona && (
            <div className={`text-center transition-all duration-1000 delay-500 ${visibleSections.has(3) ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'}`}>
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-blue-600 text-white px-8 py-4 text-xl font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your AI Identity Quiz
              </button>
            </div>
          )}

          {showQuiz && !userPersona && (
            <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <div className="bg-gray-200 rounded-full h-2 w-48">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 animate-fade-in">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>
              </div>

              <div className="space-y-3">
                {QUIZ_QUESTIONS[quizStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => nextQuizStep(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 hover:scale-105 transform hover:-translate-y-1 animate-slide-in opacity-0`}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {userPersona && (
            <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4 animate-fade-in" style={{ color: PERSONA_DATA[userPersona].color }}>
                  You are a {userPersona}
                </h3>
                <div className="text-6xl font-bold mb-4 animate-pulse" style={{ color: PERSONA_DATA[userPersona].color }}>
                  <AnimatedCounter end={PERSONA_DATA[userPersona].percentage} suffix="%" />
                </div>
                <p className="text-gray-600 mb-6 animate-fade-in delay-300">
                  of people share your AI perspective (<AnimatedCounter end={PERSONA_DATA[userPersona].size} /> participants)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="animate-slide-in delay-500">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {PERSONA_DATA[userPersona].description}
                  </p>
                </div>
                <div className="animate-slide-in delay-700">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Your Concern Profile</h4>
                  <PersonaRadar persona={PERSONA_DATA[userPersona]} />
                </div>
              </div>

              <button 
                onClick={resetQuiz}
                className="mt-6 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-300"
              >
                Take Quiz Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Conclusion */}
      <section data-section="4" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl text-center">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-8 transition-all duration-1000 ${visibleSections.has(4) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            Your voice matters in this conversation
          </h2>
          
          <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${visibleSections.has(4) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            Whether you're cautiously optimistic like most people, deeply concerned about cultural preservation, or focused on security and safety, your perspective adds to the rich tapestry of human responses to artificial intelligence.
          </p>

          <p className={`text-lg text-gray-600 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${visibleSections.has(4) ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'}`}>
            The future of AI isn't just being written by technologists in Silicon Valley. It's being shaped by students dreaming about jobs that didn't exist a year ago, parents thinking about their children's future, artists experimenting without any limits to their creativity, aunts worrying about their grandchildren's privacy, and so many more. If we truly understand this—that AI is this incredibly complicated system that touches all these different lives in all these different ways—we as a team believe we'll be able to design solutions that actually work for real people, no matter what their individual experience with technology looks like.
          </p>

          <p className={`text-xl font-semibold text-gray-800 mb-8 transition-all duration-1000 delay-700 ${visibleSections.has(4) ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
            It's being shaped by you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-300 mb-4 animate-fade-in">
            Based on research analysis of <AnimatedCounter end={59542} /> participants across three global regions
          </p>
          <p className="text-gray-400 text-sm animate-fade-in delay-300">
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
