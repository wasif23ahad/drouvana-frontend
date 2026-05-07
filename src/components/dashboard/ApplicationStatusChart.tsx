"use client";

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

const data = [
  { name: 'Applied', value: 12, color: '#4F46E5' },
  { name: 'Interview', value: 4, color: '#10B981' },
  { name: 'Offer', value: 1, color: '#F59E0B' },
  { name: 'Rejected', value: 3, color: '#EF4444' },
];

const ApplicationStatusChart = () => {
  return (
    <div className="glass-card rounded-3xl p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6">Application Status</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: 'none', 
                borderRadius: '12px',
                color: '#fff' 
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ApplicationStatusChart;
