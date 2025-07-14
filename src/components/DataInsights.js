import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const DataInsights = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('sentiments');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quotes/stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insights from the data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center text-gray-600">
          <p>Unable to load data insights.</p>
          <p className="text-sm mt-2">Make sure your CSV file is properly placed and the server is running.</p>
        </div>
      </div>
    );
  }

  // Prepare sentiment data for charts
  const sentimentData = Object.entries(stats.sentiments || {}).map(([sentiment, count]) => ({
    name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    value: count,
    percentage: ((count / Object.values(stats.sentiments).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
  }));

  // Prepare top tags data
  const topTagsData = (stats.topTags || []).slice(0, 8).map(tag => ({
    name: tag.tag.length > 15 ? tag.tag.substring(0, 15) + '...' : tag.tag,
    fullName: tag.tag,
    count: tag.count
  }));

  // Colors for different sentiments
  const sentimentColors = {
    'Positive': '#10b981',
    'Negative': '#ef4444', 
    'Neutral': '#6b7280'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            Count: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600">
            Count: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-gray-600">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Voice Analysis: What the Data Reveals
      </h3>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.uniqueParticipants || 0}</div>
          <div className="text-sm text-gray-600">Unique Voices</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(stats.questionCounts || {}).length}
          </div>
          <div className="text-sm text-gray-600">Questions Asked</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(stats.topTags || []).length}
          </div>
          <div className="text-sm text-gray-600">Different Tags</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {stats.averageTagsPerQuote ? stats.averageTagsPerQuote.toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-600">Avg Tags/Response</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'sentiments', label: '😊 Sentiments', icon: '📊' },
          { id: 'tags', label: '🏷️ Popular Tags', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'sentiments' && sentimentData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sentiment Pie Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Sentiment Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sentimentColors[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Sentiment Breakdown
            </h4>
            <div className="space-y-3">
              {sentimentData.map((sentiment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: sentimentColors[sentiment.name] || '#6b7280' }}
                    ></div>
                    <span className="font-medium text-gray-800">{sentiment.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{sentiment.value}</div>
                    <div className="text-sm text-gray-600">{sentiment.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'tags' && topTagsData.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Most Common Tags in Responses
          </h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topTagsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Top Tags List */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {(stats.topTags || []).slice(0, 12).map((tag, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="font-semibold text-blue-800 text-sm">
                  {tag.tag.length > 12 ? tag.tag.substring(0, 12) + '...' : tag.tag}
                </div>
                <div className="text-blue-600 font-bold">{tag.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {sentimentData.length === 0 && topTagsData.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg mb-2">📊 No analysis data available</p>
          <p className="text-sm">
            Place your all_thought_labels.csv file in backend/data/raw/ to see real insights
          </p>
        </div>
      )}
      
      <div className="mt-6 text-center text-xs text-gray-500">
        Analysis based on ResponseText, Sentiment, and Tag columns from your CSV data
      </div>
    </div>
  );
};
