import React from 'react';
import styles from './HistorySection.module.css';
import Skeleton from '../Skeleton/Skeleton';

export default function HistorySection({ logs, loading }) {
  const getAIIcon = (provider) => {
    const p = provider?.toLowerCase();
    const images = {
      openai: '/images/ai/openai.png',
      claude: '/images/ai/claude.png',
      gemini: '/images/ai/gemini.png',
      groq: '/images/ai/groq.png',
    };

    if (images[p]) {
      return (
        <div style={{ backgroundColor: '#000', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', padding: '4px' }}>
          <img src={images[p]} alt={provider} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      );
    }

    return '🧠';
  };

  const getPlatformIcon = (platform) => {
    const p = platform?.toLowerCase();
    if (p === '99freelas') {
      return <img src="/images/99freelas.png" alt="99Freelas" style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />;
    }
    if (p === 'workana') {
      return <img src="/images/workana.png" alt="Workana" style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />;
    }
    if (p === 'freelancer') {
      return <img src="/images/freelancer.png" alt="Freelancer" style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />;
    }
    return '💼';
  };

  const getUserPhoto = (log) => {
    const photos = {
      'Patrick Siqueira': '/images/patrick.png',
      'Beatriz Nascimento': '/images/beatriz.png',
    };
    return photos[log.userName] || null;
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
                  <span className={styles.label}>{log.provider?.toUpperCase()}</span>
                  <span className={styles.value} style={{ fontSize: '0.8rem', opacity: 0.9 }}>{log.model}</span>
                </div>
              </div>

              <div style={{ minWidth: '120px' }}>
                <span className={styles.label}>Remetente</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  {getUserPhoto(log) && (
                    <img src={getUserPhoto(log)} alt="" style={{ width: '22px', height: '22px', borderRadius: '6px', objectFit: 'cover' }} />
                  )}
                  <span className={styles.value} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    {log.userName || 'Sistema'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={styles.label}>Plataforma</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getPlatformIcon(log.platform)}
                  <span className={styles.value} style={{ fontSize: '0.75rem' }}>{log.platform}</span>
                </div>
              </div>

              <div className={styles.hideMobile}>
                <span className={styles.label}>Tokens</span>
                <span className={styles.value}>{( (log.tokensInput || 0) + (log.tokensOutput || 0) ).toLocaleString()}</span>
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
