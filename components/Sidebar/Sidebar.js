import React from 'react';
import styles from './Sidebar.module.css';
import { LayoutDashboard, FileText, Settings, BarChart3, LogOut, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Auto-Proposal</div>
      
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="#" className={styles.navLink}>
          <BarChart3 size={20} />
          <span>Métricas</span>
        </Link>
        <Link href="#" className={styles.navLink}>
          <FileText size={20} />
          <span>Logs</span>
        </Link>
        <Link href="#" className={styles.navLink}>
          <Cpu size={20} />
          <span>Modelos IA</span>
        </Link>
        <Link href="#" className={styles.navLink}>
          <Settings size={20} />
          <span>Ajustes</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <div className={styles.avatar}>PG</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Patrick Gomes</span>
          <span className={styles.userRole}>Super Admin</span>
        </div>
        <Link href="/login" style={{ marginLeft: 'auto', color: 'var(--muted-foreground)' }}>
          <LogOut size={18} />
        </Link>
      </div>
    </aside>
  );
}
