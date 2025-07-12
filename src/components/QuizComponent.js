import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

export const QuizComponent = ({ onComplete, userPersona }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            You've discovered your AI perspective!
          </h2>
          <button 
            onClick={resetQuiz}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Where do you fit in this story?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take our research-based quiz to discover which of the five AI personas best represents your perspective.
        </p>
      </div>

      {!showQuiz ? (
        <div className="text-center">
          <button 
            onClick={() => setShowQuiz(true)}
            className="bg-blue-600 text-white px-8 py-4 text-xl font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start Your AI Identity Quiz
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <div className="bg-gray-200 rounded-full h-2 w-48">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>
          </div>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
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