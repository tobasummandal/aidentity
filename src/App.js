import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const App = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [userPersona, setUserPersona] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [titleAnimated, setTitleAnimated] = useState(false);

  // Quiz Questions
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

  // Persona Data
  const PERSONA_DATA = {
    "Balanced Social Participant": {
      size: 35344,
      percentage: 59.4,
      color: "#7994b5",
      description: "You approach AI with cautious optimism, recognizing both opportunities and risks. You value social connection and worry about technology isolating people, but you also see AI's potential to enhance human collaboration.",
      fearProfile: {
        economic: 0.25,
        surveillance: 0.20,
        social: 0.45,
        safety: 0.15,
        cultural: 0.10
      }
    },
    "Consistent Social Responder": {
      size: 13241,
      percentage: 22.2,
      color: "#93b778",
      description: "You engage thoughtfully with AI questions and show consistent concern patterns. Social isolation and maintaining human connections are your primary concerns as AI develops.",
      fearProfile: {
        economic: 0.35,
        surveillance: 0.15,
        social: 0.40,
        safety: 0.25,
        cultural: 0.05
      }
    },
    "Balanced Security Participant": {
      size: 2023,
      percentage: 3.4,
      color: "#d17c3f",
      description: "You prioritize safety and security in AI development. You want careful regulation and oversight to ensure AI systems are safe and beneficial for everyone.",
      fearProfile: {
        economic: 0.20,
        surveillance: 0.45,
        social: 0.15,
        safety: 0.50,
        cultural: 0.15
      }
    },
    "Cultural Preservationist": {
      size: 4987,
      percentage: 8.4,
      color: "#be7249",
      description: "You're concerned about AI's impact on cultural values and traditions. You want to ensure that technological progress doesn't erode the cultural foundations that give life meaning.",
      fearProfile: {
        economic: 0.15,
        surveillance: 0.25,
        social: 0.20,
        safety: 0.10,
        cultural: 0.55
      }
    },
    "Technology-Aware Participant": {
      size: 3947,
      percentage: 6.6,
      color: "#b63e36",
      description: "You understand technology dependence risks but remain engaged. You're aware of the potential pitfalls of AI while appreciating its capabilities.",
      fearProfile: {
        economic: 0.30,
        surveillance: 0.35,
        social: 0.25,
        safety: 0.30,
        cultural: 0.20
      }
    }
  };

  // Research data from your JSON files
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
    ],
    regional: [
      { 
        region: "North America", 
        economic: 3.2, 
        surveillance: 2.8, 
        social: 4.1, 
        safety: 3.5, 
        cultural: 2.9,
        participants: 20994,
        fearIndex: 0.033
      },
      { 
        region: "Europe", 
        economic: 2.8, 
        surveillance: 3.1, 
        social: 3.3, 
        safety: 3.2, 
        cultural: 3.8,
        participants: 22042,
        fearIndex: 0.016
      },
      { 
        region: "Asia-Pacific", 
        economic: 4.1, 
        surveillance: 3.9, 
        social: 4.8, 
        safety: 3.7, 
        cultural: 4.2,
        participants: 16506,
        fearIndex: 0.022
      }
    ]
  };

  const nextQuizStep = (answerIndex) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      calculatePersona(newAnswers);
    }
  };

  const calculatePersona = (answers) => {
    const scores = {
      "Balanced Social Participant": 0,
      "Consistent Social Responder": 0,
      "Balanced Security Participant": 0,
      "Cultural Preservationist": 0,
      "Technology-Aware Participant": 0
    };

    // Simple scoring algorithm based on answer patterns
    answers.forEach((answer, index) => {
      switch(index) {
        case 0: // Job displacement
          if (answer === 0) scores["Balanced Social Participant"] += 2;
          if (answer === 1) scores["Technology-Aware Participant"] += 2;
          if (answer === 2) scores["Consistent Social Responder"] += 2;
          if (answer === 3) scores["Balanced Security Participant"] += 2;
          break;
        case 1: // Privacy
          if (answer === 1 || answer === 3) scores["Balanced Security Participant"] += 2;
          if (answer === 0 || answer === 4) scores["Technology-Aware Participant"] += 2;
          break;
        case 2: // Future vision
          if (answer === 0) scores["Balanced Social Participant"] += 2;
          if (answer === 3) scores["Cultural Preservationist"] += 2;
          break;
        case 3: // Education
          if (answer === 4) scores["Cultural Preservationist"] += 2;
          if (answer === 2) scores["Consistent Social Responder"] += 2;
          if (answer === 1) scores["Balanced Security Participant"] += 2;
          break;
        case 4: // AI mistakes
          if (answer === 3) scores["Balanced Security Participant"] += 2;
          if (answer === 0 || answer === 4) scores["Technology-Aware Participant"] += 2;
          break;
      }
    });

    const topPersona = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    );

    setUserPersona(topPersona[0]);
  };

  const PersonaRadar = ({ persona }) => {
    const [selectedFear, setSelectedFear] = useState(null);
    const [animateRadar, setAnimateRadar] = useState(false);

    const data = [
      { fear: 'Economic', value: persona.fearProfile.economic * 100, description: 'Job displacement and economic impact concerns' },
      { fear: 'Surveillance', value: persona.fearProfile.surveillance * 100, description: 'Privacy and data monitoring worries' },
      { fear: 'Social', value: persona.fearProfile.social * 100, description: 'Human connection and isolation fears' },
      { fear: 'Safety', value: persona.fearProfile.safety * 100, description: 'AI safety and security concerns' },
      { fear: 'Cultural', value: persona.fearProfile.cultural * 100, description: 'Cultural preservation and values protection' }
    ];

    useEffect(() => {
      const timer = setTimeout(() => setAnimateRadar(true), 500);
      return () => clearTimeout(timer);
    }, []);

    const CustomRadarTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const fearData = data.find(d => d.fear === label);
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-800">{label} Concern</p>
            <p className="text-lg font-bold" style={{ color: persona.color }}>
              {payload[0].value.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">{fearData?.description}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="fear" 
              tick={{ fontSize: 12, cursor: 'pointer' }}
              onClick={(data) => setSelectedFear(selectedFear === data.payload.fear ? null : data.payload.fear)}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 60]} 
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Radar
              name="Concern Level"
              dataKey="value"
              stroke={persona.color}
              fill={persona.color}
              fillOpacity={animateRadar ? 0.3 : 0}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: persona.color }}
              activeDot={{ r: 6, stroke: persona.color, strokeWidth: 2, fill: '#fff' }}
              className="transition-all duration-1000"
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Interactive Fear Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {data.map((fearItem, index) => (
            <div 
              key={fearItem.fear}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                selectedFear === fearItem.fear ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedFear(selectedFear === fearItem.fear ? null : fearItem.fear)}
            >
              <div className="w-3 h-3 rounded" style={{ backgroundColor: persona.color }}></div>
              <span className="text-gray-700">{fearItem.fear}: {fearItem.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SlotMachine = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuote, setCurrentQuote] = useState('Click SPIN to see what the world thinks.');
    const [isTyping, setIsTyping] = useState(false);
    const [slotEmojis, setSlotEmojis] = useState(['😈', '😛', '😢']);
    const [isSpinning, setIsSpinning] = useState(false);
    
    const emojis = ["😈", "😛", "😢", "😌", "😏", "😳", "😅", "😎", "😇", "😴"];
    
    // Load CSV data using Papa.parse
    useEffect(() => {
      const loadQuotesFromCSV = async () => {
        try {
          // Try to load CSV file from public directory
          const response = await fetch('/all_thought_labels.csv');
          if (response.ok) {
            const csvData = await response.text();
            Papa.parse(csvData, {
              header: true,
              complete: function(results) {
                // Find the column with the longest average value (likely the thought column)
                const rows = results.data;
                if (!rows.length) {
                  setQuotes(getSampleQuotes());
                  return;
                }
                const headers = Object.keys(rows[0]);
                let bestCol = headers[0];
                let bestLen = 0;
                headers.forEach(col => {
                  // Calculate average length for this column
                  const avgLen = rows
                    .map(row => (row[col] || '').length)
                    .reduce((a, b) => a + b, 0) / rows.length;
                  if (avgLen > bestLen) {
                    bestLen = avgLen;
                    bestCol = col;
                  }
                });
                // Now use the bestCol for quotes
                const loadedQuotes = rows
                  .map(row => row[bestCol])
                  .filter(q => q && q.trim().length > 0 && q.trim().length > 10);
                
                if (loadedQuotes.length > 0) {
                  setQuotes(loadedQuotes);
                } else {
                  setQuotes(getSampleQuotes());
                }
              }
            });
          } else {
            setQuotes(getSampleQuotes());
          }
        } catch (error) {
          console.log('Could not load CSV, using sample quotes');
          setQuotes(getSampleQuotes());
        }
      };

      loadQuotesFromCSV();
    }, []);

    const getSampleQuotes = () => [
      "AI will help us solve climate change faster than we could alone.",
      "I worry that AI will make human creativity obsolete.",
      "Machine learning should be taught in elementary schools.",
      "AI assistants make me feel less lonely when I work from home.",
      "We need global regulations for AI before it's too late.",
      "I use AI to help with my daily tasks and it's incredibly useful.",
      "AI art doesn't have the same soul as human-created art.",
      "Automation will create more jobs than it destroys.",
      "I'm concerned about AI bias affecting important decisions.",
      "AI helps me be more productive and creative in my work.",
      "We should be teaching kids to work with AI, not against it.",
      "I don't trust AI with important medical or legal decisions.",
      "AI translation helps me connect with people worldwide.",
      "The AI revolution feels like it's happening too fast.",
      "I'm excited about AI's potential to cure diseases.",
      "AI surveillance makes me worried about privacy.",
      "Machine learning has improved my photo editing so much.",
      "We need to ensure AI benefits everyone, not just the wealthy.",
      "AI chatbots sometimes understand me better than humans do.",
      "I'm afraid AI will make human intelligence seem less valuable."
    ];
    
    const typeQuote = (text) => {
      setIsTyping(true);
      setCurrentQuote('');
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setCurrentQuote(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 20);
    };
    
    const spin = () => {
      if (isSpinning) return;
      
      setIsSpinning(true);
      
      // Animate emoji slots
      const newEmojis = [
        emojis[Math.floor(Math.random() * emojis.length)],
        emojis[Math.floor(Math.random() * emojis.length)],
        emojis[Math.floor(Math.random() * emojis.length)]
      ];
      
      setSlotEmojis(newEmojis);
      
      // Pick random quote and type it
      if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setTimeout(() => typeQuote(randomQuote), 300);
      }
      
      setTimeout(() => setIsSpinning(false), 600);
    };
    
    return (
      <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Slot for Thought
        </h3>
        
        <div className="relative flex flex-col items-center">
          {/* Arrows */}
          <div className="flex justify-center gap-16 mb-2">
            <span className="text-3xl text-gray-400">▲</span>
            <span className="text-3xl text-gray-400">▲</span>
            <span className="text-3xl text-gray-400">▲</span>
          </div>
          
          {/* Slot Machine */}
          <div className="flex justify-center gap-8 mb-2 relative">
            {slotEmojis.map((emoji, index) => (
              <div
                key={index}
                className={`text-7xl w-36 h-36 bg-white border-2 border-gray-200 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isSpinning ? 'animate-spin' : ''
                }`}
                style={{ 
                  transform: isSpinning ? 'rotateX(180deg)' : 'rotateX(0deg)',
                  animation: isSpinning ? 'spin 0.6s ease-in-out' : 'none'
                }}
              >
                {emoji}
              </div>
            ))}
            
            {/* Quote Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 shadow-lg max-w-80 min-w-60 text-center z-10 opacity-95">
              <span className={`text-gray-700 ${isTyping ? 'border-r-2 border-gray-700' : ''}`}>
                {currentQuote}
              </span>
            </div>
          </div>
          
          {/* Bottom Arrows */}
          <div className="flex justify-center gap-16 mb-6">
            <span className="text-3xl text-gray-400">▼</span>
            <span className="text-3xl text-gray-400">▼</span>
            <span className="text-3xl text-gray-400">▼</span>
          </div>
          
          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning}
            className="bg-blue-200 text-gray-800 border-3 border-gray-800 px-8 py-3 text-xl font-bold tracking-wide shadow-md hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ 
              borderRadius: '0',
              boxShadow: '4px 4px 0 #374151',
              fontFamily: 'monospace'
            }}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN TO FIND OUT'}
          </button>
        </div>
        
        <p className="text-sm text-gray-600 text-center mt-4">
          Random thoughts from our global research participants
        </p>
      </div>
    );
  };

  const CorrelationInsights = () => {
    const [selectedInsight, setSelectedInsight] = useState(null);
    const [animationTriggered, setAnimationTriggered] = useState(false);

    const correlationData = [
      { 
        id: 'social',
        percentage: 67, 
        title: 'Social Isolation → AI Anxiety',
        description: 'Social fears correlate with overall AI anxiety',
        detail: 'People who worry about AI isolating humans from each other are significantly more likely to have general anxiety about AI technology. This suggests that maintaining human connection is a core concern.',
        color: 'blue',
        insights: [
          'Strongest predictor of overall AI fear',
          'Universal across all cultural regions',
          'Drives 67% of general AI anxiety patterns'
        ]
      },
      { 
        id: 'economic',
        percentage: 39, 
        title: 'Economic Concerns → General Fear',
        description: 'Economic concerns drive general AI fear',
        detail: 'Job displacement and economic disruption fears contribute significantly to how people feel about AI overall. However, this is less predictive than social concerns.',
        color: 'red',
        insights: [
          'Second strongest fear driver',
          'Varies significantly by region',
          'Higher in economically uncertain areas'
        ]
      },
      { 
        id: 'surveillance',
        percentage: 41, 
        title: 'Surveillance → Overall Anxiety',
        description: 'Surveillance fears connect to overall anxiety',
        detail: 'Privacy and surveillance concerns are moderately correlated with general AI anxiety, showing that trust and control issues matter significantly.',
        color: 'orange',
        insights: [
          'Moderate but consistent correlation',
          'Growing concern in all regions',
          'Connected to broader trust issues'
        ]
      },
      { 
        id: 'cultural_economic',
        percentage: -7, 
        title: 'Cultural ≠ Economic Concerns',
        description: 'Cultural and economic fears operate independently',
        detail: 'Interestingly, people who worry about cultural preservation don\'t necessarily worry about economic impacts, and vice versa. These represent distinct psychological patterns.',
        color: 'purple',
        insights: [
          'Independent fear categories',
          'Different psychological drivers',
          'Requires separate policy approaches'
        ]
      }
    ];

    useEffect(() => {
      const timer = setTimeout(() => setAnimationTriggered(true), 1000);
      return () => clearTimeout(timer);
    }, []);

    const getColorClasses = (color, selected = false) => {
      const colors = {
        blue: selected ? 'bg-blue-100 border-blue-400' : 'bg-blue-50 hover:bg-blue-100',
        red: selected ? 'bg-red-100 border-red-400' : 'bg-red-50 hover:bg-red-100',
        orange: selected ? 'bg-orange-100 border-orange-400' : 'bg-orange-50 hover:bg-orange-100',
        purple: selected ? 'bg-purple-100 border-purple-400' : 'bg-purple-50 hover:bg-purple-100'
      };
      return colors[color] || colors.blue;
    };

    const getTextColor = (color) => {
      const colors = {
        blue: 'text-blue-600',
        red: 'text-red-600',
        orange: 'text-orange-600',
        purple: 'text-purple-600'
      };
      return colors[color] || colors.blue;
    };

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          The Psychology of AI Relationships
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Research reveals the interconnected nature of AI concerns. Some fears cluster together, 
          while others operate independently in the human psyche.
          <br />
          <span className="text-sm text-blue-600">Click insights below for detailed analysis</span>
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {correlationData.map((item, index) => (
            <div 
              key={item.id}
              className={`text-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                getColorClasses(item.color, selectedInsight === item.id)
              } ${selectedInsight === item.id ? 'border-2' : 'border border-transparent'}`}
              onClick={() => setSelectedInsight(selectedInsight === item.id ? null : item.id)}
            >
              <div className={`text-2xl font-bold ${getTextColor(item.color)} transition-all duration-1000 ${
                animationTriggered ? 'animate-pulse-custom' : ''
              }`}>
                <AnimatedCounter end={Math.abs(item.percentage)} suffix={item.percentage < 0 ? '% ⟂' : '%'} />
              </div>
              <div className="text-sm text-gray-600 mt-2">{item.description}</div>
              <div className="text-xs text-gray-400 mt-1">
                {selectedInsight === item.id ? 'Click to collapse' : 'Click for details'}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Analysis Panel */}
        {selectedInsight && (
          <div className="animate-fade-in-up bg-gray-50 rounded-lg p-6 border-l-4" 
               style={{ borderColor: correlationData.find(item => item.id === selectedInsight)?.color === 'blue' ? '#3b82f6' : 
                                     correlationData.find(item => item.id === selectedInsight)?.color === 'red' ? '#ef4444' :
                                     correlationData.find(item => item.id === selectedInsight)?.color === 'orange' ? '#f97316' : '#8b5cf6' }}>
            <div className="flex justify-between items-start mb-4">
              <h4 className={`text-xl font-bold ${getTextColor(correlationData.find(item => item.id === selectedInsight)?.color)}`}>
                {correlationData.find(item => item.id === selectedInsight)?.title}
              </h4>
              <button 
                onClick={() => setSelectedInsight(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-700 mb-4">
              {correlationData.find(item => item.id === selectedInsight)?.detail}
            </p>
            
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-800">Key Insights:</h5>
              {correlationData.find(item => item.id === selectedInsight)?.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    correlationData.find(item => item.id === selectedInsight)?.color === 'blue' ? 'bg-blue-500' :
                    correlationData.find(item => item.id === selectedInsight)?.color === 'red' ? 'bg-red-500' :
                    correlationData.find(item => item.id === selectedInsight)?.color === 'orange' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-gray-600">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p className="text-center">
            <strong>Research Methodology:</strong> Correlation analysis of 59,542 survey responses across 10 psychological dimensions. 
            Values represent Pearson correlation coefficients showing the strength of relationships between different AI concerns.
          </p>
        </div>
      </div>
    );
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

    const handleBarClick = (data, index) => {
      setSelectedPersona(selectedPersona === index ? null : index);
    };

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-800">{label.replace('\n', ' ')}</p>
            <p className="text-blue-600 font-bold text-lg">{data.percentage}%</p>
            <p className="text-gray-600">{data.participants.toLocaleString()} participants</p>
            <p className="text-sm text-gray-500 mt-2 italic">"{data.description}"</p>
            <p className="text-xs text-gray-400 mt-1">Click for detailed profile</p>
          </div>
        );
      }
      return null;
    };

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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={RESEARCH_DATA.personas} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="percentage" 
              radius={[4, 4, 0, 0]}
              onMouseEnter={(data, index) => setHoveredPersona(index)}
              onMouseLeave={() => setHoveredPersona(null)}
            >
              {RESEARCH_DATA.personas.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={selectedPersona === index ? '#1f2937' : 'none'}
                  strokeWidth={selectedPersona === index ? 3 : 0}
                  opacity={hoveredPersona !== null && hoveredPersona !== index ? 0.6 : 1}
                  style={{ 
                    cursor: 'pointer',
                    filter: hoveredPersona === index ? 'brightness(1.1)' : 'none'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Interactive Persona Details */}
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

        {/* Interactive Legend */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 text-sm">
          {RESEARCH_DATA.personas.map((persona, index) => (
            <div 
              key={index} 
              className={`text-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedPersona === index ? 'ring-2 ring-blue-400' : ''
              }`}
              style={{ backgroundColor: `${persona.color}20` }}
              onClick={() => setSelectedPersona(selectedPersona === index ? null : index)}
              onMouseEnter={() => setHoveredPersona(index)}
              onMouseLeave={() => setHoveredPersona(null)}
            >
              <div className="font-semibold" style={{ color: persona.color }}>
                {persona.name.replace('\n', ' ')}
              </div>
              <div className="text-gray-600 text-xs">{persona.participants.toLocaleString()} people</div>
              <div className="text-xs text-gray-400 mt-1">Click to explore</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RegionalAnalysisChart = () => {
    const [selectedFear, setSelectedFear] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [viewMode, setViewMode] = useState('stacked'); // 'stacked' or 'comparative'

    const fearTypes = [
      { key: 'economic', name: 'Economic', color: '#ef4444', description: 'Concerns about job displacement and economic impact' },
      { key: 'surveillance', name: 'Privacy', color: '#f97316', description: 'Worries about surveillance and data privacy' },
      { key: 'social', name: 'Social', color: '#eab308', description: 'Fears about social isolation and human connection' },
      { key: 'safety', name: 'Safety', color: '#22c55e', description: 'Safety and security concerns about AI systems' },
      { key: 'cultural', name: 'Cultural', color: '#3b82f6', description: 'Concerns about cultural preservation and values' }
    ];

    const CustomRegionalTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const regionData = RESEARCH_DATA.regional.find(r => r.region === label);
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <p className="font-semibold text-gray-800 mb-2">{label}</p>
            <p className="text-sm text-gray-600 mb-2">
              {regionData.participants.toLocaleString()} participants • Fear Index: {(regionData.fearIndex * 100).toFixed(1)}%
            </p>
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm">{entry.name}: {entry.value.toFixed(1)}/5</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-2">Click region for detailed analysis</p>
          </div>
        );
      }
      return null;
    };

    const handleRegionClick = (data) => {
      setSelectedRegion(selectedRegion === data.region ? null : data.region);
    };

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            Global AI Concern Patterns by Region
          </h3>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${viewMode === 'stacked' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('stacked')}
            >
              Stacked View
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${viewMode === 'comparative' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('comparative')}
            >
              Comparative View
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-center mb-6">
          Regional differences in AI fears reveal cultural and economic influences on technology perspectives.
          <br />
          <span className="text-sm text-blue-600">Click regions for detailed breakdown • Toggle view modes above</span>
        </p>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={RESEARCH_DATA.regional} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={handleRegionClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="region" />
            <YAxis domain={[0, 5]} />
            <Tooltip content={<CustomRegionalTooltip />} />
            
            {fearTypes.map((fear, index) => (
              <Bar 
                key={fear.key}
                dataKey={fear.key} 
                fill={fear.color} 
                name={fear.name}
                opacity={selectedFear && selectedFear !== fear.key ? 0.3 : 1}
                onMouseEnter={() => setSelectedFear(fear.key)}
                onMouseLeave={() => setSelectedFear(null)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        
        {/* Interactive Legend with Fear Type Details */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
          {fearTypes.map((fear) => (
            <div 
              key={fear.key}
              className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-all duration-200 ${
                selectedFear === fear.key ? 'bg-gray-100 scale-105' : 'hover:scale-105'
              }`}
              onMouseEnter={() => setSelectedFear(fear.key)}
              onMouseLeave={() => setSelectedFear(null)}
            >
              <div className="w-4 h-4 rounded" style={{ backgroundColor: fear.color }}></div>
              <span className="font-medium">{fear.name}</span>
            </div>
          ))}
        </div>

        {/* Selected Fear Type Details */}
        {selectedFear && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in-up">
            <h5 className="font-semibold text-gray-800 mb-2">
              {fearTypes.find(f => f.key === selectedFear)?.name} Concerns
            </h5>
            <p className="text-gray-600 text-sm mb-3">
              {fearTypes.find(f => f.key === selectedFear)?.description}
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {RESEARCH_DATA.regional.map((region) => (
                <div key={region.region} className="bg-white p-3 rounded">
                  <div className="font-semibold text-gray-800">{region.region}</div>
                  <div className="text-2xl font-bold" style={{ color: fearTypes.find(f => f.key === selectedFear)?.color }}>
                    {region[selectedFear].toFixed(1)}/5
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Breakdown Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {RESEARCH_DATA.regional.map((region, index) => (
            <div 
              key={index} 
              className={`bg-gray-50 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRegion === region.region ? 'ring-2 ring-blue-400 bg-blue-50' : ''
              }`}
              onClick={() => handleRegionClick(region)}
            >
              <div className="font-semibold text-gray-800">{region.region}</div>
              <div className="text-gray-600">{region.participants.toLocaleString()} participants</div>
              <div className="text-xs text-gray-500 mt-1">
                Fear Index: {(region.fearIndex * 100).toFixed(1)}%
              </div>
              {selectedRegion === region.region && (
                <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in-up">
                  <div className="text-xs text-left space-y-1">
                    {fearTypes.map((fear) => (
                      <div key={fear.key} className="flex justify-between">
                        <span>{fear.name}:</span>
                        <span className="font-semibold">{region[fear.key].toFixed(1)}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
        
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
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
        
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(20) forwards;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* Interactive hover effects */
        .interactive-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        /* Chart animation delays */
        .chart-animate {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }
        
        .chart-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        
        .opacity-0 { opacity: 0; }
        
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="relative h-screen flex items-center justify-center text-center px-4" data-section="0">
        <div className="max-w-4xl">
          <h1 className={`text-6xl md:text-8xl font-black text-gray-800 mb-4 tracking-tight ${titleAnimated ? 'animate-typewriter' : 'opacity-0'}`}>
            (AI)DENTITY
          </h1>
          <p className={`text-2xl md:text-3xl text-gray-600 mb-8 font-light ${titleAnimated ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            Who Are We in the Age of Algorithms?
          </p>
          <p className={`text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed ${titleAnimated ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
            A personal journey through <AnimatedCounter end={59542} /> voices and what they taught me about our relationship with artificial intelligence
          </p>
          <p className={`text-md text-gray-400 mt-4 ${titleAnimated ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
            by Sarena Yousuf, Şefika Öztürk and Tobasum Mandal
          </p>
        </div>
      </header>

      {/* Personal Introduction */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16" data-section="1">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <p className={`text-2xl font-light mb-8 text-gray-800 ${visibleSections.has(1) ? 'animate-fade-in-up' : 'opacity-0'}`}>
            I used to think I knew how people felt about AI. I was wrong.
          </p>
          
          <p className={`mb-6 ${visibleSections.has(1) ? 'animate-slide-in-left delay-200' : 'opacity-0'}`}>
            Last year, during my very first new media art class in college, my professor told us we could use AI for our final projects, as long as we wrote a reflection on how our interaction with ChatGPT helped us. He even mentioned that he was using AI to help with his personal work. "Isn't that cheating?" I asked timidly during his office hours. He shared that he believes it's just a tool, and as long as the artist's intention is achieved, it's no different to him than using a camera. Meanwhile, my aunt in Kashmir had just gotten a new phone so she could use voice assistants, but she was convinced she was being watched by the military.
          </p>

          <p className={`mb-6 ${visibleSections.has(1) ? 'animate-slide-in-right delay-300' : 'opacity-0'}`}>
            That night, I realized something: we all have completely different relationships with AI, shaped by our backgrounds, fears, desires, sins and hopes. Some of us embrace it, others resist it, and many of us exist somewhere in between, confused and conflicted.
          </p>

          <p className={`mb-6 ${visibleSections.has(1) ? 'animate-slide-in-left delay-500' : 'opacity-0'}`}>
            I spent the next year in computer science, film and art classes where my projects became an attempt to answer why different people in my college, and in my own family, interact with AI so differently. I was trying to define my own boundaries and fascinations around AI in my life. So when my friends shared that we could access research data about this, we dove into findings from <AnimatedCounter end={59542} /> people across three continents who had shared their deepest thoughts about artificial intelligence. What we found wasn't just data, it was like looking into a mirror that reflected all of our messy, complicated feelings about living with algorithms.
          </p>

          <p className={`text-xl font-medium text-gray-800 mt-12 ${visibleSections.has(1) ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
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
            <p>
              Asia-Pacific participants showed the highest concerns about social isolation, perhaps reflecting collectivist cultural values where community bonds are paramount. North Americans worried most about economic displacement, while Europeans demonstrated more balanced concern across all areas.
            </p>
          </div>
        </div>
      </section>

      {/* Psychology Deep Dive */}
      <section data-section="4" className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(4) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              The interconnected web of AI emotions
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 ${visibleSections.has(4) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Human feelings about AI don't exist in isolation. Our research reveals the complex psychological connections between different concerns, fears, and hopes about artificial intelligence.
            </p>
          </div>

          <div className={`chart-animate ${visibleSections.has(4) ? 'animate-slide-in-left delay-500' : 'opacity-0'}`}>
            <CorrelationInsights />
          </div>
        </div>
      </section>

      {/* Personal Stories within Data */}
      <section data-section="5" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <h2 className={`text-4xl font-bold text-gray-800 mb-8 text-center ${visibleSections.has(5) ? 'animate-fade-in-up' : 'opacity-0'}`}>
            The stories behind the statistics
          </h2>
          
          <div className={`bg-blue-50 p-8 rounded-2xl mb-8 hover:bg-blue-100 transition-colors duration-300 ${visibleSections.has(5) ? 'animate-slide-in-left delay-200' : 'opacity-0'}`}>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">The Balanced Social Participant (<AnimatedCounter end={59.4} suffix="%" />)</h3>
            <p className="mb-4">
              Meet Maria, a representative voice from this largest group. She's a working mother in her 30s who uses AI tools for work efficiency but worries about her children losing face-to-face social skills. She represents the majority of us—cautiously optimistic but deeply concerned about maintaining human connection.
            </p>
            <p className="text-blue-700 italic">
              "I want AI to help us, not replace what makes us human."
            </p>
          </div>

          <div className={`bg-green-50 p-8 rounded-2xl mb-8 hover:bg-green-100 transition-colors duration-300 ${visibleSections.has(5) ? 'animate-slide-in-right delay-500' : 'opacity-0'}`}>
            <h3 className="text-2xl font-semibold text-green-800 mb-4">The Consistent Social Responder (<AnimatedCounter end={22.2} suffix="%" />)</h3>
            <p className="mb-4">
              Think of David, a community organizer who sees AI through the lens of social justice. He worries about algorithmic bias and economic inequality, but engages thoughtfully with AI development rather than rejecting it outright.
            </p>
            <p className="text-green-700 italic">
              "Technology should bring us together, not drive us apart."
            </p>
          </div>

          <div className={`bg-orange-50 p-8 rounded-2xl mb-8 hover:bg-orange-100 transition-colors duration-300 ${visibleSections.has(5) ? 'animate-slide-in-left delay-700' : 'opacity-0'}`}>
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
      <section data-section="6" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(6) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Where do you fit in this story?
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${visibleSections.has(6) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Take our research-based quiz to discover which of the five AI personas best represents your perspective. Your answers will be compared against patterns from <AnimatedCounter end={59542} /> global participants.
            </p>
          </div>

          {!showQuiz && !userPersona && (
            <div className={`text-center ${visibleSections.has(6) ? 'animate-pulse-custom delay-500' : 'opacity-0'}`}>
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-blue-600 text-white px-8 py-4 text-xl font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your AI Identity Quiz
              </button>
            </div>
          )}

          {showQuiz && !userPersona && (
            <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in-up">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <div className="bg-gray-200 rounded-full h-3 w-48 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 animate-fade-in-up">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>
                
                {/* Progress Indicator */}
                <div className="flex justify-center mb-4">
                  {QUIZ_QUESTIONS.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                        index < quizStep ? 'bg-green-500' : 
                        index === quizStep ? 'bg-blue-500 animate-pulse' : 
                        'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {QUIZ_QUESTIONS[quizStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => nextQuizStep(index)}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md group animate-slide-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{option}</span>
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-blue-400 transition-colors duration-200 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Answer Preview for Previous Questions */}
              {quizAnswers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Your Previous Responses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {quizAnswers.map((answer, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                        Q{index + 1}: Option {answer + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {userPersona && (
            <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="mb-4">
                  <div className="inline-block p-4 rounded-full animate-bounce-in" style={{ backgroundColor: `${PERSONA_DATA[userPersona].color}20` }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: PERSONA_DATA[userPersona].color }}>
                      {userPersona.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 animate-fade-in-up" style={{ color: PERSONA_DATA[userPersona].color }}>
                  You are a {userPersona}
                </h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold animate-pulse-custom" style={{ color: PERSONA_DATA[userPersona].color }}>
                      <AnimatedCounter end={PERSONA_DATA[userPersona].percentage} suffix="%" />
                    </div>
                    <div className="text-sm text-gray-500">of global population</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      <AnimatedCounter end={PERSONA_DATA[userPersona].size} />
                    </div>
                    <div className="text-sm text-gray-500">people like you</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 animate-fade-in-up delay-300">
                  You share your AI perspective with <AnimatedCounter end={PERSONA_DATA[userPersona].size} /> participants from our global study
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="animate-slide-in-left delay-500">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Your AI Relationship Profile</h4>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {PERSONA_DATA[userPersona].description}
                  </p>
                  
                  {/* Quiz Answer Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">Your Response Pattern:</h5>
                    <div className="space-y-2 text-sm">
                      {quizAnswers.map((answer, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">
                              {QUIZ_QUESTIONS[index].question}
                            </div>
                            <div className="text-gray-600 italic">
                              "{QUIZ_QUESTIONS[index].options[answer]}"
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="animate-slide-in-right delay-700">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Your Concern Profile</h4>
                  <PersonaRadar persona={PERSONA_DATA[userPersona]} />
                </div>
              </div>

              {/* Persona Comparison */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  How You Compare to Other AI Perspectives
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(PERSONA_DATA).map(([name, data]) => (
                    <div 
                      key={name}
                      className={`text-center p-3 rounded-lg transition-all duration-300 ${
                        name === userPersona 
                          ? 'ring-2 ring-blue-400 bg-blue-50 scale-105' 
                          : 'bg-gray-50 hover:bg-gray-100 opacity-75'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" 
                           style={{ backgroundColor: data.color }}>
                        {name.split(' ').map(word => word[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-gray-800">{name}</div>
                      <div className="text-xs text-gray-600">{data.percentage}%</div>
                      {name === userPersona && (
                        <div className="text-xs text-blue-600 font-semibold mt-1">You are here!</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button 
                  onClick={() => {
                    setShowQuiz(false);
                    setUserPersona(null);
                    setQuizStep(0);
                    setQuizAnswers([]);
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-300"
                >
                  Take Quiz Again
                </button>
                <button 
                  onClick={() => {
                    // Scroll to research sections
                    document.querySelector('[data-section="2"]').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                >
                  Explore the Research
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Slot Machine */}
      <section data-section="6.5" className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${visibleSections.has(6.5) ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Voices from the Global Conversation
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 ${visibleSections.has(6.5) ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Spin to discover real thoughts from our <AnimatedCounter end={59542} /> participants. 
              Each quote represents a genuine perspective on AI from someone, somewhere in the world.
            </p>
          </div>

          <div className={`${visibleSections.has(6.5) ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
            <SlotMachine />
          </div>
        </div>
      </section>

      {/* Deeper Insights */}
      <section data-section="7" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl prose prose-lg text-gray-700 leading-relaxed">
          <h2 className={`text-4xl font-bold text-gray-800 mb-8 text-center ${visibleSections.has(7) ? 'animate-fade-in-up' : 'opacity-0'}`}>
            What this means for our shared future
          </h2>
          
          <p className={`text-xl mb-8 ${visibleSections.has(7) ? 'animate-slide-in-left delay-200' : 'opacity-0'}`}>
            The research revealed something profound: there's no single "right" way to think about AI. Our perspectives are shaped by our experiences, values, and circumstances.
          </p>

          <p className={`mb-6 ${visibleSections.has(7) ? 'animate-slide-in-right delay-300' : 'opacity-0'}`}>
            The <AnimatedCounter end={59.4} suffix="%" /> who are "Balanced Social Participants" aren't fence-sitters. They're thoughtful people trying to navigate a complex technological landscape while preserving what they value most about human connection.
          </p>

          <p className={`mb-6 ${visibleSections.has(7) ? 'animate-slide-in-left delay-500' : 'opacity-0'}`}>
            The <AnimatedCounter end={8.4} suffix="%" /> who are "Cultural Preservationists" aren't Luddites. They're guardians of traditions and values that have sustained communities for generations, asking important questions about what we might lose in our rush toward the future.
          </p>

          <p className={`mb-6 ${visibleSections.has(7) ? 'animate-slide-in-right delay-700' : 'opacity-0'}`}>
            Even the <AnimatedCounter end={3.4} suffix="%" /> focused on security aren't paranoid. They're people who understand that powerful technologies require careful oversight and regulation to serve the common good.
          </p>

          <p className={`text-xl font-semibold text-gray-800 mt-12 ${visibleSections.has(7) ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
            Understanding these perspectives isn't just an academic exercise. As AI reshapes our world, we need to design technology that serves all these viewpoints, not just the loudest voices in the room.
          </p>
        </div>
      </section>

      {/* Conclusion */}
      <section data-section="8" className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl text-center">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-8 ${visibleSections.has(8) ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Your voice matters in this conversation
          </h2>
          
          <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed ${visibleSections.has(8) ? 'animate-slide-in-left delay-300' : 'opacity-0'}`}>
            Whether you're cautiously optimistic like most people, deeply concerned about cultural preservation, or focused on security and safety, your perspective adds to the rich tapestry of human responses to artificial intelligence.
          </p>

          <p className={`text-lg text-gray-600 mb-12 max-w-3xl mx-auto ${visibleSections.has(8) ? 'animate-slide-in-right delay-500' : 'opacity-0'}`}>
            The future of AI isn't just being written by technologists in Silicon Valley. It's being shaped by students dreaming about jobs that didn't exist a year ago, parents thinking about their children's future, artists experimenting without any limits to their creativity, aunts worrying about their grandchildren's privacy, and so many more. If we truly understand this, that AI is this incredibly complicated system that touches all these different lives in all these different ways, we as a team believe we'll be able to design solutions that actually work for real people, no matter what their individual experience with technology looks like.
          </p>

          <p className={`text-xl font-semibold text-gray-800 mb-8 ${visibleSections.has(8) ? 'animate-pulse-custom delay-700' : 'opacity-0'}`}>
            It's being shaped by you.
          </p>

          <div className={`bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto hover:shadow-xl transition-all duration-500 ${visibleSections.has(8) ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Join the Global Conversation</h3>
            <p className="text-gray-600 mb-6">
              This research continues to evolve as more voices join the conversation about AI's role in our lives.
            </p>
            <a 
              href="https://github.com/collect-intel/global-dialogues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-decoration-none"
            >
              Tell stories we couldn't
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-300 mb-4 animate-fade-in-up">
            Based on research analysis of <AnimatedCounter end={59542} /> participants across three global regions
          </p>
          <p className="text-gray-400 text-sm animate-fade-in-up delay-300">
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
