'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação de login - Em produção, conectaria à sua API
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.visualSide}>
        <h1 className={styles.logo}>Auto-Proposal</h1>
        <p className={styles.tagline}>
          Gerencie suas propostas com inteligência artificial de última geração e métricas em tempo real.
        </p>
      </div>
      
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Bem-vindo</h2>
          <p className={styles.subtitle}>Entre com suas credenciais para acessar o painel BI.</p>
          
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={18} 
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} 
                />
                <input 
                  type="email" 
                  className={styles.input} 
                  style={{ paddingLeft: '48px' }}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={18} 
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} 
                />
                <input 
                  type="password" 
                  className={styles.input} 
                  style={{ paddingLeft: '48px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className={styles.submitBtn}>
              Acessar Painel <ArrowRight size={18} />
            </button>
          </form>
          
          <p className={styles.footerText}>
            Não tem uma conta? <a href="#" className={styles.link}>Entre em contato</a>
          </p>
        </div>
      </div>
    </div>
  );
}
