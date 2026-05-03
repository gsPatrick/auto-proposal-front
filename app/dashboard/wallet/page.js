'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import walletStyles from './wallet.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { api } from '../../../lib/api';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, RefreshCw, DollarSign, Clock, FileText } from 'lucide-react';

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState({});
  const [history, setHistory] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');
  const [depositProvider, setDepositProvider] = useState('openai');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balanceData, historyData] = await Promise.all([
        api.getBalance(),
        api.getWalletHistory()
      ]);
      setBalances(balanceData);
      setHistory(historyData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      await api.addDeposit({
        amount: depositAmount,
        description: depositDesc || `Depósito Manual (${depositProvider})`,
        provider: depositProvider,
        userId: user.id,
        userName: user.name
      });
      setShowDepositModal(false);
      setDepositAmount('');
      setDepositDesc('');
      fetchData();
    } catch (err) {
      alert('Erro ao realizar depósito');
    }
  };

  const providers = [
    { id: 'openai', label: 'OpenAI', img: '/images/ai/openai.png' },
    { id: 'claude', label: 'Claude', img: '/images/ai/claude.png' },
    { id: 'google', label: 'Google', img: '/images/ai/gemini.png' },
    { id: 'groq', label: 'Groq', img: '/images/ai/groq.png' }
  ];

  return (
    <main className={styles.main} style={{ paddingLeft: isSidebarCollapsed ? '80px' : '260px' }}>
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Minha Carteira</h1>
            <p>Gerenciamento de saldo e histórico de consumo em dólar.</p>
          </div>

          <div className={styles.controls}>
            <button className={walletStyles.depositBtn} onClick={() => setShowDepositModal(true)}>
              <Plus size={18} />
              Adicionar Saldo
            </button>
            <button className={styles.timeBtn} onClick={fetchData}>
              <RefreshCw size={16} className={loading ? 'ap-spin' : ''} />
            </button>
          </div>
        </header>

        <section className={walletStyles.balanceGrid}>
          {providers.map(p => (
            <div key={p.id} className={walletStyles.balanceCardSmall}>
              <div className={walletStyles.cardIcon}>
                <img src={p.img} alt={p.label} />
              </div>
              <div className={walletStyles.cardInfo}>
                <span className={walletStyles.cardLabel}>{p.label}</span>
                <h3 className={walletStyles.cardValue}>$ {(balances[p.id] || 0).toFixed(4)}</h3>
              </div>
            </div>
          ))}
        </section>

        <div className={walletStyles.historyContainer}>
          <div className={walletStyles.historyHeader}>
            <h3>Extrato de Movimentações</h3>
            <span className={walletStyles.historySubtitle}>Últimas 100 transações</span>
          </div>

          {loading ? (
             <Skeleton type="table" />
          ) : (
            <div className={walletStyles.tableWrapper}>
              <table className={walletStyles.table}>
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Provedor</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Saldo Anterior</th>
                    <th>Novo Saldo</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx) => (
                    <tr key={tx.id}>
                      <td className={walletStyles.dateCell}>
                        <Clock size={14} />
                        {new Date(tx.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className={walletStyles.providerCell}>
                        <img src={`/images/ai/${tx.provider === 'google' ? 'gemini' : tx.provider === 'claude' ? 'claude' : tx.provider === 'openai' ? 'openai' : 'groq'}.png`} alt={tx.provider} />
                        {tx.provider?.toUpperCase()}
                      </td>
                      <td>
                        <span className={`${walletStyles.typeBadge} ${tx.type === 'deposit' ? walletStyles.typeDeposit : walletStyles.typeUsage}`}>
                          {tx.type === 'deposit' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                          {tx.type === 'deposit' ? 'Depósito' : 'Consumo'}
                        </span>
                      </td>
                      <td className={tx.type === 'deposit' ? walletStyles.amountPositive : walletStyles.amountNegative}>
                        {tx.type === 'deposit' ? '+' : '-'} ${parseFloat(tx.amount).toFixed(4)}
                      </td>
                      <td>$ {parseFloat(tx.previousBalance).toFixed(4)}</td>
                      <td className={walletStyles.bold}>$ {parseFloat(tx.newBalance).toFixed(4)}</td>
                      <td className={walletStyles.descCell}>{tx.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showDepositModal && (
        <div className={walletStyles.modalOverlay}>
          <div className={walletStyles.modal}>
            <div className={walletStyles.modalHeader}>
              <h3>Adicionar Saldo Manual</h3>
              <button onClick={() => setShowDepositModal(false)} className={walletStyles.closeBtn}>×</button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className={walletStyles.formGroup}>
                <label>Selecione o Provedor</label>
                <div className={walletStyles.providerGrid}>
                  {providers.map(p => (
                    <div 
                      key={p.id} 
                      className={`${walletStyles.providerOption} ${depositProvider === p.id ? walletStyles.providerActive : ''}`}
                      onClick={() => setDepositProvider(p.id)}
                    >
                      <img src={p.img} alt={p.label} />
                      <span>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={walletStyles.formGroup}>
                <label>Valor (USD)</label>
                <div className={walletStyles.inputWrapper}>
                  <DollarSign size={16} />
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className={walletStyles.formGroup}>
                <label>Descrição (Opcional)</label>
                <div className={walletStyles.inputWrapper}>
                  <FileText size={16} />
                  <input 
                    type="text" 
                    value={depositDesc}
                    onChange={(e) => setDepositDesc(e.target.value)}
                    placeholder="Ex: Recarga OpenAI"
                  />
                </div>
              </div>
              <button type="submit" className={walletStyles.submitBtn}>Confirmar Depósito</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
