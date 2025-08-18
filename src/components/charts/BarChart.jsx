import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { barChartData, COLORS } from '../../data/mockData';

const BarChartComponent = ({ data = barChartData, dataKeys = ['online', 'inStore'], xAxisDataKey = 'name' }) => {
  const renderBars = () => {
    return dataKeys.map((key, index) => (
      <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
    ));
  };

  // Check if dark mode is enabled
  const isDarkMode = document.querySelector('body')?.classList.contains('dark');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4b5563' : '#ccc'} />
        <XAxis dataKey={xAxisDataKey} stroke={isDarkMode ? '#d1d5db' : '#888'} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={isDarkMode ? '#d1d5db' : '#888'} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={isDarkMode ? {
            backgroundColor: '#1f2937',
            borderColor: '#4b5563',
            color: '#f9fafb'
          } : {}}
        />
        <Legend />
        {renderBars()}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;