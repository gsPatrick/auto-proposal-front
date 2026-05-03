'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import HistorySection from '../../../components/HistorySection/HistorySection';
import FilterBar from '../../../components/FilterBar/FilterBar';
import { api } from '../../../lib/api';
import { RefreshCw } from 'lucide-react';

export default function LogsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchLogs = async (range, currentFilters = {}) => {
    setLoading(true);
    try {
      const data = await api.getLogs(range, currentFilters);
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(timeRange, filters);
  }, [timeRange, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className={styles.main} style={{ paddingLeft: isSidebarCollapsed ? '80px' : '260px' }}>
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Histórico Completo</h1>
            <p>Visualize todos os disparos de propostas e detalhes de consumo de tokens.</p>
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
            <button className={styles.timeBtn} onClick={() => fetchLogs(timeRange, filters)}>
              <RefreshCw size={16} className={loading ? 'ap-spin' : ''} />
            </button>
          </div>
        </header>

        <FilterBar onFilterChange={handleFilterChange} />

        <div className={styles.fullWidthSection}>
          <HistorySection logs={logs} loading={loading} />
        </div>
      </div>
    </main>
  );
}
