'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import styles from './team.module.css';
import { api } from '../../../lib/api';
import { Users, Send, DollarSign, Cpu, Globe, TrendingUp } from 'lucide-react';

export default function TeamPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getUserMetrics();
      setMembers(data);
    } catch (err) {
      console.error('Erro ao carregar equipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];
    return colors[index % colors.length];
  };

  return (
    <main className={styles.main} style={{ paddingLeft: collapsed ? '80px' : '260px' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Equipe</h1>
            <p className={styles.subtitle}>Desempenho individual de cada operador</p>
          </div>
          <div className={styles.headerBadge}>
            <Users size={16} />
            <span>{members.length} membros</span>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Carregando dados da equipe...</div>
        ) : (
          <>
            {/* Cards de Usuários */}
            <div className={styles.membersGrid}>
              {members.map((member, idx) => (
                <div
                  key={member.id}
                  className={`${styles.memberCard} ${selectedUser?.id === member.id ? styles.memberCardActive : ''}`}
                  onClick={() => setSelectedUser(selectedUser?.id === member.id ? null : member)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.avatar} style={{ background: getAvatarColor(idx) }}>
                      {getInitials(member.name)}
                    </div>
                    <div className={styles.memberInfo}>
                      <h3>{member.name}</h3>
                      <span className={styles.email}>{member.email}</span>
                    </div>
                  </div>

                  <div className={styles.statsRow}>
                    <div className={styles.stat}>
                      <Send size={14} />
                      <div>
                        <span className={styles.statValue}>{member.proposalCount}</span>
                        <span className={styles.statLabel}>Propostas</span>
                      </div>
                    </div>
                    <div className={styles.stat}>
                      <DollarSign size={14} />
                      <div>
                        <span className={styles.statValue}>$ {member.totalSpent.toFixed(4)}</span>
                        <span className={styles.statLabel}>Gasto Total</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tagsRow}>
                    <div className={styles.tag}>
                      <Cpu size={12} />
                      <span>{member.topModel || 'N/A'}</span>
                    </div>
                    <div className={styles.tagPlatform}>
                      <Globe size={12} />
                      <span>{member.topPlatform || 'N/A'}</span>
                    </div>
                  </div>

                  {member.proposalCount > 0 && (
                    <div className={styles.avgCost}>
                      <TrendingUp size={12} />
                      <span>Custo médio: $ {(member.totalSpent / member.proposalCount).toFixed(4)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Detalhes do Usuário Selecionado */}
            {selectedUser && (
              <div className={styles.detailSection}>
                <h2 className={styles.detailTitle}>
                  Raio-X: {selectedUser.name}
                </h2>

                <div className={styles.detailGrid}>
                  <div className={styles.detailCard}>
                    <div className={styles.detailIcon}><Send size={20} /></div>
                    <div>
                      <span className={styles.detailValue}>{selectedUser.proposalCount}</span>
                      <span className={styles.detailLabel}>Total de Propostas</span>
                    </div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.detailIcon}><DollarSign size={20} /></div>
                    <div>
                      <span className={styles.detailValue}>$ {selectedUser.totalSpent.toFixed(4)}</span>
                      <span className={styles.detailLabel}>Investimento Total</span>
                    </div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.detailIcon}><Cpu size={20} /></div>
                    <div>
                      <span className={styles.detailValue}>{selectedUser.topModel || 'N/A'}</span>
                      <span className={styles.detailLabel}>Modelo Favorito</span>
                    </div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.detailIcon}><Globe size={20} /></div>
                    <div>
                      <span className={styles.detailValue}>{selectedUser.topPlatform || 'N/A'}</span>
                      <span className={styles.detailLabel}>Plataforma Principal</span>
                    </div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.detailIcon}><TrendingUp size={20} /></div>
                    <div>
                      <span className={styles.detailValue}>
                        $ {selectedUser.proposalCount > 0 ? (selectedUser.totalSpent / selectedUser.proposalCount).toFixed(4) : '0.0000'}
                      </span>
                      <span className={styles.detailLabel}>Custo Médio / Proposta</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
