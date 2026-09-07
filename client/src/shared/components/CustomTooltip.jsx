import React from 'react';

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-gray-700/80 text-xs space-y-1 z-50">
        {label && <p className="font-extrabold text-brand-400 border-b border-gray-800 pb-1 mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color || entry.fill || '#FF6B00' }}
            />
            <span className="font-semibold text-gray-200">
              {entry.name || entry.dataKey}: <strong className="text-white font-extrabold">{entry.value}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
