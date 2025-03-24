import React from 'react';

export const Gauge = ({ value, label }) => {
  const percentage = Math.min(100, Math.max(0, value));
  const color = percentage > 80 ? '#ef4444' : percentage > 60 ? '#f59e0b' : '#10b981';

  return (
    <div className="relative w-full h-8 bg-gray-200 rounded-full">
      <div 
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {label}: {percentage}%
      </div>
    </div>
  );
};

export const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center">
          <div className="w-1/4 text-sm truncate">{item.name}</div>
          <div className="flex-1 ml-2">
            <div 
              className="h-6 bg-blue-500 rounded"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="relative h-40">
      {data.map((item, i) => (
        <div 
          key={i}
          className="absolute bottom-0 bg-blue-500 w-4 rounded-t"
          style={{
            left: `${(i / data.length) * 100}%`,
            height: `${(item.value / maxValue) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        />
      ))}
    </div>
  );
};
