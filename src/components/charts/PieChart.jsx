import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { pieChartData, COLORS } from '../../data/mockData';

const PieChartComponent = ({ data = pieChartData, colors = COLORS }) => {
  // Check if dark mode is enabled
  const isDarkMode = document.querySelector('body')?.classList.contains('dark');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}`}
          contentStyle={isDarkMode ? {
            backgroundColor: '#1f2937',
            borderColor: '#4b5563',
            color: '#f9fafb'
          } : {}}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: isDarkMode ? '#f9fafb' : '#333' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;