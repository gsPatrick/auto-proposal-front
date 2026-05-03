'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://geral-auto-proposal-api.r954jc.easypanel.host/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(true);
        // Delay para a animação cinematográfica
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      if (!success) setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.transitionOverlay}>
        <div className={styles.transitionContent}>
          <div className={styles.loaderLine}></div>
          <h2 className={styles.transitionTitle}>Bem-vindo, {email.split('@')[0]}</h2>
          <p className={styles.transitionSubtitle}>Preparando seu centro de comando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.visualSide}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className={styles.bgVideo}
        >
          <source src="/videos/login_bg.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay}></div>
        
        <div className={styles.visualContent}>
          <h1 className={styles.heroTitle}>Auto-Proposal <span className={styles.glowText}>AI</span></h1>
          <p className={styles.heroSubtitle}>A próxima geração de propostas estratégicas impulsionadas por inteligência artificial.</p>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <h2>Bem-vindo de volta</h2>
            <p>Entre com suas credenciais para acessar o painel administrativo.</p>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>E-mail</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.icon} size={18} />
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Senha</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.icon} size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button className={styles.submitBtn} disabled={loading}>
              {loading ? <Loader2 className="ap-spin" size={20} /> : (
                <>Acessar Painel <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
