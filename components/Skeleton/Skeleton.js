import React from 'react';
import styles from './Skeleton.module.css';

export default function Skeleton({ type = 'rect', width, height, style }) {
  const className = `${styles.skeleton} ${styles[type] || styles.rect}`;
  
  return (
    <div 
      className={className} 
      style={{ width, height, ...style }}
    />
  );
}
