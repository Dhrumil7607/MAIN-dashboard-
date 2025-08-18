import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { lineChartData, COLORS } from '../../data/mockData';

const LineChartComponent = ({ data = lineChartData, dataKeys = ['visits', 'conversions'], xAxisDataKey = 'name' }) => {
  const renderLines = () => {
    return dataKeys.map((key, index) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={COLORS[index % COLORS.length]}
        activeDot={{ r: 8 }}
      />
    ));
  };

  // Check if dark mode is enabled
  const isDarkMode = document.querySelector('body')?.classList.contains('dark');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        {renderLines()}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;