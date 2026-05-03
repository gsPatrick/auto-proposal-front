'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import ChartSection from '../../../components/ChartSection/ChartSection';
import StatsCard from '../../../components/StatsCard/StatsCard';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { api } from '../../../lib/api';
import { DollarSign, Zap, TrendingUp, RefreshCw } from 'lucide-react';

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchMetrics = async (range) => {
    setLoading(true);
    try {
      const data = await api.getMetrics(range);
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(timeRange);
  }, [timeRange]);

  return (
    <main className={styles.main} style={{ paddingLeft: isSidebarCollapsed ? '80px' : '260px' }}>
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Análise de Métricas</h1>
            <p>Visão detalhada de gastos e performance dos modelos de IA.</p>
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
            <button className={styles.timeBtn} onClick={() => fetchMetrics(timeRange)}>
              <RefreshCw size={16} className={loading ? 'ap-spin' : ''} />
            </button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} type="card" />)
          ) : (
            <>
              <StatsCard label="Investimento" value={`US$ ${metrics?.totalCost?.toFixed(4) || '0.00'}`} icon={DollarSign} color="var(--primary)" />
              <StatsCard label="Tokens Consumidos" value={(metrics?.totalTokens || 0).toLocaleString()} icon={Zap} color="var(--warning)" />
              <StatsCard label="Custo Médio / Prop" value={`US$ ${metrics?.avgCostPerProposal?.toFixed(4) || '0.00'}`} icon={TrendingUp} color="var(--success)" />
            </>
          )}
        </section>

        <div className={styles.fullWidthSection}>
          {loading ? (
            <Skeleton type="chart" />
          ) : (
            <ChartSection title="Evolução de Gastos (USD)" data={metrics?.chartData} />
          )}
        </div>
      </div>
    </main>
  );
}
