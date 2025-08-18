import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { areaChartData, COLORS } from '../../data/mockData';

const AreaChartComponent = ({ data = areaChartData, xAxisDataKey = 'name', dataKeys = ['revenue', 'profit'] }) => {
  // Check if dark mode is enabled
  const isDarkMode = document.querySelector('body')?.classList.contains('dark');

  const renderAreas = () => {
    return dataKeys.map((key, index) => (
      <Area
        key={key}
        type="monotone"
        dataKey={key}
        stackId="1"
        stroke={COLORS[index % COLORS.length]}
        fill={COLORS[index % COLORS.length]}
        fillOpacity={0.6}
      />
    ));
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4b5563' : '#ccc'} />
          <XAxis dataKey={xAxisDataKey} stroke={isDarkMode ? '#d1d5db' : '#888'} />
          <YAxis stroke={isDarkMode ? '#d1d5db' : '#888'} />
          <Tooltip
            contentStyle={isDarkMode ? {
              backgroundColor: '#1f2937',
              borderColor: '#4b5563',
              color: '#f9fafb'
            } : {}}
          />
          {renderAreas()}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;