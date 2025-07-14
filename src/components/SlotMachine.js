import React, { useState, useEffect } from 'react';

export const SlotMachine = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [currentQuoteText, setCurrentQuoteText] = useState('Click SPIN to see what the world thinks.');
  const [isTyping, setIsTyping] = useState(false);
  const [slotEmojis, setSlotEmojis] = useState(['😈', '😛', '😢']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // all, positive, negative, neutral
  const [availableStats, setAvailableStats] = useState(null);
  
  const emojis = ["😈", "😛", "😢", "😌", "😏", "😳", "😅", "😎", "😇", "😴", "🤔", "😊", "😟", "🙄", "😮"];
  
  // Load CSV data and stats
  useEffect(() => {
    loadQuotesAndStats();
  }, []);

  const loadQuotesAndStats = async () => {
    try {
      // Load quotes
      const quotesResponse = await fetch('/api/quotes');
      const quotesData = await quotesResponse.json();
      
      if (quotesData.quotes && quotesData.quotes.length > 0) {
        setQuotes(quotesData.quotes);
        if (quotesData.stats) {
          setAvailableStats(quotesData.stats);
        }
      } else {
        loadSampleQuotes();
      }
      
    } catch (error) {
      console.error('Error loading quotes:', error);
      loadSampleQuotes();
    }
  };

  const loadSampleQuotes = () => {
    const sampleQuotes = [
      {
        text: "AI will help us solve climate change faster than we could alone.",
        sentiment: "positive",
        tags: ["environment", "optimism"],
        participantId: "Sample001"
      },
      {
        text: "I worry that AI will make human creativity obsolete.",
        sentiment: "negative", 
        tags: ["creativity", "concern"],
        participantId: "Sample002"
      },
      {
        text: "Machine learning should be taught in elementary schools.",
        sentiment: "positive",
        tags: ["education", "early-learning"],
        participantId: "Sample003"
      },
      {
        text: "AI assistants make me feel less lonely when I work from home.",
        sentiment: "positive",
        tags: ["companionship", "remote-work"],
        participantId: "Sample004"
      },
      {
        text: "We need global regulations for AI before it's too late.",
        sentiment: "neutral",
        tags: ["regulation", "safety"],
        participantId: "Sample005"
      }
    ];
    setQuotes(sampleQuotes);
  };
  
  const typeQuote = (quoteObj) => {
    setIsTyping(true);
    setCurrentQuoteText('');
    setCurrentQuote(quoteObj);
    
    let i = 0;
    const text = quoteObj.text;
    const interval = setInterval(() => {
      if (i < text.length) {
        setCurrentQuoteText(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };
  
  const spin = () => {
    if (isSpinning || quotes.length === 0) return;
    
    setIsSpinning(true);
    
    // Animate emoji slots - use different emojis based on sentiment
    const newEmojis = [
      emojis[Math.floor(Math.random() * emojis.length)],
      emojis[Math.floor(Math.random() * emojis.length)],
      emojis[Math.floor(Math.random() * emojis.length)]
    ];
    
    setSlotEmojis(newEmojis);
    
    // Filter quotes based on current filter mode
    let filteredQuotes = quotes;
    if (filterMode !== 'all') {
      filteredQuotes = quotes.filter(quote => 
        quote.sentiment && quote.sentiment.toLowerCase() === filterMode.toLowerCase()
      );
    }
    
    if (filteredQuotes.length === 0) {
      filteredQuotes = quotes; // Fallback to all quotes
    }
    
    // Pick random quote and type it
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    setTimeout(() => typeQuote(randomQuote), 300);
    
    setTimeout(() => setIsSpinning(false), 600);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Slot for Thought
      </h3>
      
      {/* Filter Controls */}
      <div className="flex justify-center gap-2 mb-6">
        {['all', 'positive', 'neutral', 'negative'].map(filter => (
          <button
            key={filter}
            onClick={() => setFilterMode(filter)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              filterMode === filter 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter === 'all' ? '🎯 All' : 
             filter === 'positive' ? '😊 Positive' :
             filter === 'negative' ? '😟 Concerned' : '😐 Neutral'}
          </button>
        ))}
      </div>
      
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
          
          {/* Enhanced Quote Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-lg px-6 py-4 shadow-lg max-w-96 min-w-80 text-center z-10 opacity-97">
            <div className={`text-gray-700 mb-2 ${isTyping ? 'border-r-2 border-gray-700' : ''}`}>
              "{currentQuoteText}"
            </div>
            
            {/* Quote Metadata */}
            {currentQuote && !isTyping && (
              <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 mb-1">
                  <span className={`flex items-center gap-1 ${getSentimentColor(currentQuote.sentiment)}`}>
                    {getSentimentIcon(currentQuote.sentiment)}
                    {currentQuote.sentiment || 'neutral'}
                  </span>
                  {currentQuote.participantId && (
                    <span className="text-gray-400">
                      ID: {currentQuote.participantId}
                    </span>
                  )}
                </div>
                
                {/* Tags */}
                {currentQuote.tags && currentQuote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {currentQuote.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {currentQuote.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{currentQuote.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
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
          {isSpinning ? 'SPINNING...' : `SPIN FOR ${filterMode.toUpperCase()} THOUGHTS`}
        </button>
      </div>
      
      {/* Statistics Display */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="font-bold text-blue-600">{quotes.length}</div>
          <div className="text-gray-600">Total Voices</div>
        </div>
        
        {availableStats && availableStats.sentiments && (
          <>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="font-bold text-green-600">
                {availableStats.sentiments.positive || 0}
              </div>
              <div className="text-gray-600">😊 Positive</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="font-bold text-blue-600">
                {availableStats.sentiments.neutral || 0}
              </div>
              <div className="text-gray-600">😐 Neutral</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="font-bold text-red-600">
                {availableStats.sentiments.negative || 0}
              </div>
              <div className="text-gray-600">😟 Concerned</div>
            </div>
          </>
        )}
      </div>
      
      {/* Data Source Info */}
      <p className="text-xs text-gray-500 text-center mt-4">
        {quotes.length > 5 ? 
          `Real thoughts from our global research participants` : 
          `Sample quotes (place all_thought_labels.csv in backend/data/raw/ for real data)`
        }
      </p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotateX(0); }
          50% { transform: rotateX(180deg); }
          100% { transform: rotateX(0); }
        }
      `}</style>
    </div>
  );
};
