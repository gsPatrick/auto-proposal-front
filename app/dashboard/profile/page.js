'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { User, Mail, Lock, Save, Loader2, CheckCircle, Camera, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({ id: '', name: '', email: '', password: '' });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser({ ...savedUser, password: '' });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('https://geral-auto-proposal-api.r954jc.easypanel.host/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Erro ao atualizar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main} style={{ paddingLeft: 'var(--sidebar-width, 260px)' }}>
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Perfil do Usuário</h1>
            <p>Gerencie suas informações pessoais e segurança da conta.</p>
          </div>
        </header>

        <div className={styles.topGrid} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Card Esquerdo: Avatar & Resumo */}
          <div style={{ 
            background: 'var(--card)', 
            padding: '40px 32px', 
            borderRadius: '24px', 
            border: '1px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            height: 'fit-content'
          }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'white',
                boxShadow: '0 0 30px var(--primary-glow)'
              }}>
                {user.name?.charAt(0) || 'P'}
              </div>
              <button style={{ 
                position: 'absolute', 
                bottom: '0', 
                right: '0', 
                background: '#fff', 
                border: 'none', 
                borderRadius: '50%', 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                <Camera size={18} color="#000" />
              </button>
            </div>
            <h2 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '4px' }}>{user.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '24px' }}>{user.email}</p>
            
            <div style={{ width: '100%', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Conta Verificada</span>
            </div>
          </div>

          {/* Card Direito: Formulário */}
          <div style={{ 
            background: 'var(--card)', 
            padding: '40px', 
            borderRadius: '24px', 
            border: '1px solid var(--card-border)',
            backdropFilter: 'blur(12px)'
          }}>
            <form onSubmit={handleUpdate} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '32px' 
            }}>
              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'white' }}>Informações Básicas</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', fontWeight: 600 }}>Nome Completo</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--primary)' }} />
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    style={{ width: '100%', padding: '14px 14px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', fontWeight: 600 }}>E-mail de Acesso</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--primary)' }} />
                  <input 
                    type="email" 
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    style={{ width: '100%', padding: '14px 14px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', marginBottom: '8px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'white' }}>Segurança</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', fontWeight: 600 }}>Nova Senha</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--primary)' }} />
                  <input 
                    type="password" 
                    placeholder="Deixe em branco para manter a atual"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    style={{ width: '100%', padding: '14px 14px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    width: '100%',
                    maxWidth: '300px',
                    padding: '16px 40px', 
                    background: 'var(--primary)', 
                    border: 'none', 
                    borderRadius: '12px', 
                    color: '#000', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px var(--primary-glow)'
                  }}
                >
                  {loading ? <Loader2 className="ap-spin" size={20} /> : (
                    <>{success ? <CheckCircle size={20} /> : <Save size={20} />} Salvar Alterações</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
