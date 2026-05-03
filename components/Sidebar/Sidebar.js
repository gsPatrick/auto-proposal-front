import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { LayoutDashboard, FileText, Settings, BarChart3, LogOut, Cpu, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/metrics', label: 'Métricas', icon: BarChart3 },
    { href: '/dashboard/logs', label: 'Logs', icon: FileText },
    { href: '/dashboard/profile', label: 'Perfil', icon: UserIcon },
  ];

  const handleLogout = () => {
    setLoggingOut(true);
    
    setTimeout(() => {
      localStorage.removeItem('user');
      router.push('/login');
    }, 1200);
  };

  if (loggingOut) {
    return (
      <div style={{ 
        position: 'fixed', inset: 0, background: '#000', zIndex: 9999, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontFamily: 'Outfit', fontSize: '2.5rem', marginBottom: '10px' }}>Saindo...</h2>
          <p style={{ color: '#71717a' }}>Encerrando sua sessão com segurança.</p>
        </div>
      </div>
    );
  }

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <button className={styles.toggleBtn} onClick={onToggle}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={styles.logo}>Auto-Proposal</div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.extensionBox}>
        <div className={styles.extensionHeader}>
          <span className={styles.extensionTitle}>Extensão v1.0.0</span>
          <span className={styles.versionBadge}>Chrome</span>
        </div>
        <a href="/auto-proposal-extension.zip" download className={styles.downloadLink}>
          <LogOut size={16} style={{ transform: 'rotate(90deg)' }} />
          Baixar
        </a>
      </div>

      <div className={styles.footer}>
        <div className={styles.userContainer}>
          <div className={styles.avatar}>PG</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Patrick Gomes</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className={styles.logoutBtn} title="Sair do Sistema">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
