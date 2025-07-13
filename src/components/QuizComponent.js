import React, { useState } from 'react';

export const QuizComponent = ({ onComplete, userPersona }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

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

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowQuiz(false);
  };

  if (userPersona) {
    return (
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            You've discovered your AI perspective!
          </h2>
          <button 
            onClick={resetQuiz}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full">
      {!showQuiz ? (
        <div className="text-center">
          <button 
            onClick={() => setShowQuiz(true)}
            className="bg-blue-600 text-white px-8 py-4 text-xl font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 btn-animated"
          >
            Start Your AI Identity Quiz
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in hover-lift">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <div className="bg-gray-200 rounded-full h-2 w-48 overflow-hidden progress-bar">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 animate-fade-in">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>
          </div>

          <div className="space-y-3 stagger-children">
            {QUIZ_QUESTIONS[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 quiz-option interactive-hover"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
