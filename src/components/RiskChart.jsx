import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { year: '2020', risk: 12 },
  { year: '2021', risk: 15 },
  { year: '2022', risk: 14 },
  { year: '2023', risk: 18 },
  { year: '2024', risk: 21 },
  { year: '2025', risk: 26 },
];

function RiskChart({ newDataPoint, theme }) {
  const chartData = newDataPoint 
    ? [...mockData, { year: 'NOW', risk: Number(newDataPoint) }] 
    : mockData;

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const labelColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#080808' : '#ffffff';
  const accentColor = isDark ? '#38bdf8' : '#0284c7';

  return (
    <div className="w-full h-80 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke={labelColor} 
            tick={{ fill: labelColor, fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke={labelColor} 
            tick={{ fill: labelColor, fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
              borderRadius: '12px', 
              color: isDark ? '#f8fafc' : '#0f172a',
              boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: accentColor }}
          />
          <Area 
            type="monotone" 
            dataKey="risk" 
            stroke={accentColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRisk)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskChart;