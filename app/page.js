'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Sidebar from '../components/Sidebar/Sidebar';
import StatsCard from '../components/StatsCard/StatsCard';
import ChartSection from '../components/ChartSection/ChartSection';
import HistorySection from '../components/HistorySection/HistorySection';
import Skeleton from '../components/Skeleton/Skeleton';
import { api } from '../lib/api';
import { 
  DollarSign, 
  Send, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const [metricsData, logsData] = await Promise.all([
        api.getMetrics(range),
        api.getLogs()
      ]);
      setMetrics(metricsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const aiModels = [
    { name: 'GPT-5.5 Pro', provider: 'OpenAI', status: 'Ativo', icon: '🤖' },
    { name: 'Claude 4.7 Opus', provider: 'Anthropic', status: 'Standby', icon: '🟣' },
    { name: 'Gemini 2.0 Flash', provider: 'Google', status: 'Ativo', icon: '🔑' },
    { name: 'Llama 3.3 (70B)', provider: 'Groq', status: 'Ativo', icon: '⚡' },
  ];

  return (
    <main className={styles.main}>
      <Sidebar />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Dashboard BI</h1>
            <p>Gerenciamento estratégico de propostas e custos de IA.</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.timeSelector}>
              {['day', 'week', 'month', 'year'].map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`${styles.timeBtn} ${timeRange === range ? styles.timeBtnActive : ''}`}
                >
                  {range === 'day' ? 'Hoje' : range === 'week' ? 'Semana' : range === 'month' ? 'Mês' : 'Ano'}
                </button>
              ))}
            </div>
            <button className={styles.timeBtn} onClick={() => fetchData(timeRange)}>
              <RefreshCw size={16} className={loading ? 'ap-spin' : ''} />
            </button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          {loading ? (
            [1, 2, 3, 4].map(i => <Skeleton key={i} type="card" />)
          ) : (
            <>
              <StatsCard 
                label="Gasto no Período" 
                value={`US$ ${metrics?.totalCost?.toFixed(2) || '0.00'}`} 
                icon={DollarSign} 
                trend="up" 
                trendValue={12} 
                color="var(--primary)"
              />
              <StatsCard 
                label="Envios" 
                value={metrics?.totalProposals || '0'} 
                icon={Send} 
                trend="up" 
                trendValue={8} 
                color="var(--accent)"
              />
              <StatsCard 
                label="Média de Tokens" 
                value={(metrics?.avgTokens || 0).toLocaleString()} 
                icon={Zap} 
                trend="down" 
                trendValue={3} 
                color="var(--warning)"
              />
              <StatsCard 
                label="Eficiência IA" 
                value="98.2%" 
                icon={CheckCircle2} 
                trend="up" 
                trendValue={2} 
                color="var(--success)"
              />
            </>
          )}
        </section>

        <div className={styles.bottomGrid}>
          {loading ? (
            <Skeleton type="chart" />
          ) : (
            <ChartSection title="Investimento em IA (USD)" data={metrics?.chartData} />
          )}
          
          <aside className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Modelos Disponíveis</h3>
              <Sparkles size={18} color="var(--primary)" />
            </div>

            <div className={styles.aiList}>
              {aiModels.map((model, idx) => (
                <div key={idx} className={styles.aiItem}>
                  <div className={styles.aiIcon}>{model.icon}</div>
                  <div className={styles.aiInfo}>
                    <span className={styles.aiName}>{model.name}</span>
                    <span className={styles.aiStatus}>
                      <span style={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: model.status === 'Ativo' ? 'var(--success)' : 'var(--muted)' 
                      }}></span>
                      {model.status}
                    </span>
                  </div>
                  <div className={styles.modelBadge}>{model.provider}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* NOVA SEÇÃO DE HISTÓRICO */}
        <HistorySection logs={logs} loading={loading} />
      </div>
    </main>
  );
}
