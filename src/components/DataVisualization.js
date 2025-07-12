import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { PERSONA_DATA } from '../data/personaData';
import { REGIONAL_DATA } from '../data/researchData';

export const DataVisualization = () => {
  const distributionData = Object.entries(PERSONA_DATA).map(([name, data]) => ({
    name: name.replace(/\s+/g, '\n'),
    value: data.percentage,
    color: data.color,
    size: data.size
  }));

  return (
    <div className="max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          59,542 voices became 5 human stories
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          When we analyzed how people really think about AI, clear patterns emerged. Not stereotypes or simple categories, but genuine human perspectives shaped by real concerns and hopes.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-gray-600 mt-4">
          Distribution of AI perspectives among 59,542 global participants
        </p>
      </div>

      {/* Regional Analysis */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Geography shapes how we see AI
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={REGIONAL_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="region" />
            <YAxis domain={[0, 5]} />
            <Bar dataKey="economic" fill="#ef4444" name="Economic Concerns" />
            <Bar dataKey="surveillance" fill="#f97316" name="Privacy Concerns" />
            <Bar dataKey="social" fill="#eab308" name="Social Impact" />
            <Bar dataKey="safety" fill="#22c55e" name="Safety Worries" />
            <Bar dataKey="cultural" fill="#3b82f6" name="Cultural Preservation" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div>Economic</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded"></div>Privacy</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded"></div>Social</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div>Safety</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded"></div>Cultural</div>
        </div>
      </div>
    </div>
  );
};