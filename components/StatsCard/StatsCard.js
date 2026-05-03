import React from 'react';
import styles from './StatsCard.module.css';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ label, value, icon: Icon, trend, trendValue, color }) {
  const isUp = trend === 'up';
  
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper} style={{ color: color || 'var(--primary)' }}>
          <Icon size={22} />
        </div>
        <div className={`${styles.trend} ${isUp ? styles.trendUp : styles.trendDown}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trendValue}%
        </div>
      </div>
      
      <div>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
      </div>
    </div>
  );
}
