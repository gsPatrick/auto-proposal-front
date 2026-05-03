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
  const [balances, setBalances] = useState({});
  const [logs, setLogs] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(null); // { id, name, img, balance }
  const [shownAlerts, setShownAlerts] = useState(new Set());

  const fetchData = async (range, currentFilters = {}) => {
    setLoading(true);
    try {
      const [metricsData, logsData, balanceData] = await Promise.all([
        api.getMetrics(range, currentFilters),
        api.getLogs('all', currentFilters),
        api.getBalance()
      ]);
      setMetrics(metricsData);
      setLogs(logsData || []);
      setBalances(balanceData);

      // Checa saldos baixos (Abaixo de $1.00 e acima de $0)
      Object.entries(balanceData).forEach(([id, val]) => {
        if (val <= 1.00 && val > 0 && !shownAlerts.has(id)) {
          const model = aiModels.find(m => m.id === id);
          if (model) {
            setLowBalanceAlert({ ...model, balance: val });
            setShownAlerts(prev => new Set(prev).add(id));
          }
        }
      });

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
    { id: 'openai', name: 'OpenAI', img: '/images/ai/openai.png' },
    { id: 'claude', name: 'Anthropic', img: '/images/ai/claude.png' },
    { id: 'google', name: 'Google', img: '/images/ai/gemini.png' },
    { id: 'groq', name: 'Groq', img: '/images/ai/groq.png' },
  ];

  return (
    <main className={styles.main} style={{ paddingLeft: 'var(--sidebar-width, 260px)' }}>
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
                label="Custo Médio / Prop" 
                value={`US$ ${metrics?.avgCostPerProposal?.toFixed(4) || '0.00'}`} 
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
              {aiModels.map((model) => {
                const balance = balances[model.id] || 0;
                const isActive = balance > 0;
                return (
                  <div key={model.id} className={styles.aiItem}>
                    <div className={styles.aiIcon}>
                      <img src={model.img} alt={model.name} />
                    </div>
                    <div className={styles.aiInfo}>
                      <span className={styles.aiName}>{model.name}</span>
                      <div className={styles.aiStatusWrapper}>
                        <span className={`${styles.statusDot} ${isActive ? styles.statusActive : styles.statusInactive}`}></span>
                        <span className={styles.aiStatusText}>{isActive ? 'Ativo' : 'Sem Saldo'}</span>
                      </div>
                    </div>
                    <div className={styles.aiBalance}>
                      <span className={styles.balanceVal}>$ {balance.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* HISTÓRICO OCUPANDO TUDO EMBAIXO */}
        <div className={styles.fullWidthSection}>
          <HistorySection logs={logs} loading={loading} />
        </div>
      </div>
      {/* MODAL DE SALDO BAIXO */}
      {lowBalanceAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.alertModal}>
            <div className={styles.alertHeader}>
              <div className={styles.alertIconBg}>
                <img src={lowBalanceAlert.img} alt={lowBalanceAlert.name} />
              </div>
              <div className={styles.alertTitle}>
                <h3>Saldo Crítico: {lowBalanceAlert.name}</h3>
                <p>Seus créditos estão quase acabando!</p>
              </div>
              <button className={styles.closeAlert} onClick={() => setLowBalanceAlert(null)}>×</button>
            </div>
            
            <div className={styles.alertBody}>
              <div className={styles.balanceStatus}>
                <span className={styles.statusLabel}>Saldo Restante</span>
                <span className={styles.statusValue}>$ {lowBalanceAlert.balance.toFixed(4)}</span>
              </div>
              <p className={styles.alertMessage}>
                O modelo <strong>{lowBalanceAlert.name}</strong> deixará de funcionar em breve se não houver uma recarga.
              </p>
            </div>

            <div className={styles.alertFooter}>
              <button className={styles.cancelBtn} onClick={() => setLowBalanceAlert(null)}>Depois</button>
              <button className={styles.rechargeBtn} onClick={() => {
                setLowBalanceAlert(null);
                router.push('/dashboard/wallet');
              }}>
                Recarregar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
