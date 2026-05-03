'use client';

import React from 'react';
import styles from './ChartSection.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PLATFORM_COLORS = {
  '99freelas': '#3b82f6', // Blue
  'workana': '#10b981',   // Green
  'freelancer': '#f59e0b', // Amber
  'total': '#8b5cf6'      // Purple
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipList}>
          {payload.map((entry, index) => (
            <div key={index} className={styles.tooltipItem} style={{ color: entry.color }}>
              <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
              <span style={{ textTransform: 'capitalize' }}>{entry.name}: </span>
              <strong>US$ {entry.value.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartSection({ title, data = [] }) {
  const hasData = data && data.length > 0;

  // Descobre quais plataformas existem nos dados (excluindo 'name' e 'total')
  const platforms = hasData 
    ? Object.keys(data[0]).filter(key => key !== 'name' && key !== 'total')
    : [];

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      
      <div className={styles.chartContainer}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36}/>
              
              {platforms.length > 0 ? (
                platforms.map((platform) => (
                  <Area
                    key={platform}
                    type="monotone"
                    dataKey={platform}
                    name={platform}
                    stackId="1"
                    stroke={PLATFORM_COLORS[platform] || '#8884d8'}
                    fill={PLATFORM_COLORS[platform] || '#8884d8'}
                    fillOpacity={0.4}
                  />
                ))
              ) : (
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Total"
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={0.3} 
                  fill="var(--primary)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            Aguardando dados para este período...
          </div>
        )}
      </div>
    </div>
  );
}
