import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { year: '2021', risk: 12 },
  { year: '2022', risk: 15 },
  { year: '2023', risk: 14 },
  { year: '2024', risk: 18 },
  { year: '2025', risk: 21 },
];

function RiskChart({ newDataPoint }) {
  const chartData = newDataPoint 
    ? [...mockData, { year: 'NODE-AI', risk: Number(newDataPoint) }] 
    : mockData;

  const accentColor = '#2563eb'; // blue-600

  return (
    <div className="w-full h-80 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5 5" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }} 
            axisLine={false}
            tickLine={false}
            dy={15}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#f1f5f9', 
              borderRadius: '16px', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9',
              padding: '12px'
            }}
            itemStyle={{ color: accentColor, fontWeight: 900, fontSize: '14px' }}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="risk" 
            stroke={accentColor} 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRisk)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskChart;