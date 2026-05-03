'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import styles from './team.module.css';
import { api } from '../../../lib/api';
import { Users, Send, DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';
import HistorySection from '../../../components/HistorySection/HistorySection';

const userPhotos = {
  'patrick@gmail.com': '/images/patrick.png',
  'beatrizmello@gmail.com': '/images/beatriz.png',
};

const platformLogos = {
  '99freelas': '/images/99freelas.png',
  '99Freelas': '/images/99freelas.png',
};

const aiLogos = {
  'gpt': '/images/ai/openai.png',
  'openai': '/images/ai/openai.png',
  'claude': '/images/ai/claude.png',
  'gemini': '/images/ai/gemini.png',
  'groq': '/images/ai/groq.png',
};

const getAiLogo = (model) => {
  if (!model) return null;
  const m = model.toLowerCase();
  if (m.includes('gpt')) return aiLogos['gpt'];
  if (m.includes('claude')) return aiLogos['claude'];
  if (m.includes('gemini')) return aiLogos['gemini'];
  if (m.includes('groq') || m.includes('llama') || m.includes('mixtral')) return aiLogos['groq'];
  return null;
};

const getPlatformLogo = (platform) => {
  if (!platform) return null;
  return platformLogos[platform.trim()] || platformLogos[platform.trim().toLowerCase()] || null;
};

export default function TeamPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

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

  const selectUser = async (member) => {
    if (selectedUser?.id === member.id) {
      setSelectedUser(null);
      setUserLogs([]);
      return;
    }
    setSelectedUser(member);
    setLogsLoading(true);
    try {
      const logs = await api.getLogs('all', { userId: member.id });
      setUserLogs(logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  const getPhoto = (email) => userPhotos[email] || null;

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getAvatarColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];
    return colors[index % colors.length];
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
            <div className={styles.membersGrid}>
              {members.map((member, idx) => (
                <div
                  key={member.id}
                  className={`${styles.memberCard} ${selectedUser?.id === member.id ? styles.memberCardActive : ''}`}
                  onClick={() => selectUser(member)}
                >
                  <div className={styles.cardTop}>
                    {getPhoto(member.email) ? (
                      <img src={getPhoto(member.email)} alt={member.name} className={styles.avatarImg} />
                    ) : (
                      <div className={styles.avatar} style={{ background: getAvatarColor(idx) }}>
                        {getInitials(member.name)}
                      </div>
                    )}
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
                      {getAiLogo(member.topModel) && (
                        <img src={getAiLogo(member.topModel)} alt="" className={styles.tagIcon} />
                      )}
                      <span>{member.topModel || 'N/A'}</span>
                    </div>
                    <div className={styles.tagPlatform}>
                      {getPlatformLogo(member.topPlatform) && (
                        <img src={getPlatformLogo(member.topPlatform)} alt="" className={styles.tagIcon} />
                      )}
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

            {/* Detalhes + Histórico */}
            {selectedUser && (
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  {getPhoto(selectedUser.email) ? (
                    <img src={getPhoto(selectedUser.email)} alt={selectedUser.name} className={styles.detailPhoto} />
                  ) : (
                    <div className={styles.detailAvatar}>{getInitials(selectedUser.name)}</div>
                  )}
                  <div>
                    <h2 className={styles.detailTitle}>Raio-X: {selectedUser.name}</h2>
                    <span className={styles.detailEmail}>{selectedUser.email}</span>
                  </div>
                </div>

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
                    <div className={styles.detailIcon}>
                      {getAiLogo(selectedUser.topModel) ? (
                        <img src={getAiLogo(selectedUser.topModel)} alt="" className={styles.detailIconImg} />
                      ) : '🤖'}
                    </div>
                    <div>
                      <span className={styles.detailValue}>{selectedUser.topModel || 'N/A'}</span>
                      <span className={styles.detailLabel}>Modelo Favorito</span>
                    </div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailIcon}>
                      {getPlatformLogo(selectedUser.topPlatform) ? (
                        <img src={getPlatformLogo(selectedUser.topPlatform)} alt="" className={styles.detailIconImg} />
                      ) : '🌐'}
                    </div>
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

                {/* Histórico de Disparos */}
                <HistorySection logs={userLogs} loading={logsLoading} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
