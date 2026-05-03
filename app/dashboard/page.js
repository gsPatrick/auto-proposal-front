'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatsCard from '../../components/StatsCard/StatsCard';
import ChartSection from '../../components/ChartSection/ChartSection';
import HistorySection from '../../components/HistorySection/HistorySection';
import Skeleton from '../../components/Skeleton/Skeleton';
import { api } from '../../lib/api';
import { 
  DollarSign, 
  Send, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import FilterBar from '../../components/FilterBar/FilterBar';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchData = async (range, currentFilters = {}) => {
    setLoading(true);
    try {
      const [metricsData, logsData] = await Promise.all([
        api.getMetrics(range, currentFilters),
        api.getLogs('all', currentFilters)
      ]);
      setMetrics(metricsData);
      setLogs(logsData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange, filters);
  }, [timeRange, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const aiModels = [
    { name: 'OpenAI', status: 'Ativo', img: '/images/ai/openai.png' },
    { name: 'Anthropic', status: 'Standby', img: '/images/ai/claude.png' },
    { name: 'Google', status: 'Ativo', img: '/images/ai/gemini.png' },
    { name: 'Groq', status: 'Ativo', img: '/images/ai/groq.png' },
  ];

  return (
    <main className={styles.main} style={{ paddingLeft: isSidebarCollapsed ? '80px' : '260px' }}>
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
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
            <button className={styles.timeBtn} onClick={() => fetchData(timeRange, filters)}>
              <RefreshCw size={16} className={loading ? 'ap-spin' : ''} />
            </button>
          </div>
        </header>

        <FilterBar onFilterChange={handleFilterChange} />

        <section className={styles.statsGrid}>
          {loading ? (
            [1, 2, 3, 4].map(i => <Skeleton key={i} type="card" />)
          ) : (
            <>
              <StatsCard 
                label="Gasto no Período" 
                value={`US$ ${metrics?.totalCost?.toFixed(4) || '0.00'}`} 
                icon={DollarSign} 
                trend="up" 
                trendValue={12} 
                color="var(--primary)"
              />
              <StatsCard 
                label="Envios (Propostas)" 
                value={metrics?.totalProposals || '0'} 
                icon={Send} 
                trend="up" 
                trendValue={8} 
                color="var(--accent)"
              />
              <StatsCard 
                label="Total de Tokens" 
                value={(metrics?.totalTokens || 0).toLocaleString()} 
                icon={Zap} 
                trend="up" 
                trendValue={15} 
                color="var(--warning)"
              />
              <StatsCard 
                label="Custo Total (Tokens)" 
                value={`US$ ${metrics?.totalCost?.toFixed(4) || '0.00'}`} 
                icon={CheckCircle2} 
                trend="down" 
                trendValue={5} 
                color="var(--success)"
              />
            </>
          )}
        </section>

        <div className={styles.topGrid}>
          {/* GRÁFICO (ESQUERDA) */}
          <div className={styles.chartColumn}>
            {loading ? (
              <Skeleton type="chart" />
            ) : (
              <ChartSection title="Investimento em IA (USD)" data={metrics?.chartData} />
            )}
          </div>

          {/* SIDEBAR DE MODELOS (DIREITA) */}
          <aside className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Modelos Disponíveis</h3>
              <Sparkles size={18} color="var(--primary)" />
            </div>

            <div className={styles.aiList}>
              {aiModels.map((model, idx) => (
                <div key={idx} className={styles.aiItem}>
                  <div className={styles.aiIcon} style={{ backgroundColor: '#000', padding: '4px' }}>
                    {model.img ? (
                      <img src={model.img} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      model.icon
                    )}
                  </div>
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
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* HISTÓRICO OCUPANDO TUDO EMBAIXO */}
        <div className={styles.fullWidthSection}>
          <HistorySection logs={logs} loading={loading} />
        </div>
      </div>
    </main>
  );
}
