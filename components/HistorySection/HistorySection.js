import React from 'react';
import styles from './HistorySection.module.css';
import Skeleton from '../Skeleton/Skeleton';

export default function HistorySection({ logs, loading }) {
  const getAIIcon = (provider) => {
    switch(provider?.toLowerCase()) {
      case 'openai': return '🤖';
      case 'claude': return '🟣';
      case 'gemini': return '🔑';
      case 'groq': return '⚡';
      default: return '🧠';
    }
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <Skeleton width="200px" height="24px" />
        </div>
        <div className={styles.list}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height="70px" style={{ borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Histórico de Disparos</h3>
      </div>

      <div className={styles.list}>
        {logs && logs.length > 0 ? (
          logs.map((log, idx) => (
            <div key={log.id || idx} className={styles.item} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={styles.iaCell}>
                <div className={styles.aiIcon}>{getAIIcon(log.provider)}</div>
                <div>
                  <span className={styles.label}>Provider</span>
                  <span className={styles.value}>{log.provider?.toUpperCase()}</span>
                </div>
              </div>

              <div>
                <span className={styles.label}>Modelo</span>
                <span className={styles.value}>{log.model}</span>
              </div>

              <div className={styles.hideMobile}>
                <span className={styles.label}>Input</span>
                <span className={styles.value}>{log.tokensInput?.toLocaleString()} tkn</span>
              </div>

              <div className={styles.hideMobile}>
                <span className={styles.label}>Output</span>
                <span className={styles.value}>{log.tokensOutput?.toLocaleString()} tkn</span>
              </div>

              <div>
                <span className={styles.label}>Custo</span>
                <span className={`${styles.value} ${styles.cost}`}>
                  US$ {Number(log.cost || 0).toFixed(4)}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={styles.label}>Data / Horário</span>
                <span className={styles.date}>
                  {new Date(log.createdAt).toLocaleString('pt-BR', { 
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            Nenhum disparo encontrado para este período.
          </div>
        )}
      </div>
    </div>
  );
}
