'use client';

import React from 'react';
import styles from './ChartSection.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipValue}>US$ {payload[0].value.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

export default function ChartSection({ title, data = [] }) {
  // Se não houver dados, exibe um estado vazio amigável
  const hasData = data && data.length > 0;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      
      <div className={styles.chartContainer}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
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
