import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export const PersonaRadar = ({ persona }) => {
  const data = [
    { fear: 'Economic', value: persona.fearProfile.economic * 100 },
    { fear: 'Surveillance', value: persona.fearProfile.surveillance * 100 },
    { fear: 'Social', value: persona.fearProfile.social * 100 },
    { fear: 'Safety', value: persona.fearProfile.safety * 100 },
    { fear: 'Cultural', value: persona.fearProfile.cultural * 100 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="fear" />
        <PolarRadiusAxis angle={90} domain={[0, 60]} />
        <Radar
          name="Concern Level"
          dataKey="value"
          stroke={persona.color}
          fill={persona.color}
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};