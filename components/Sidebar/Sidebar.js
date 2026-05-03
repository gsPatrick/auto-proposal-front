import { LayoutDashboard, FileText, Settings, BarChart3, LogOut, Cpu, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/metrics', label: 'Métricas', icon: BarChart3 },
    { href: '/dashboard/logs', label: 'Logs', icon: FileText },
    { href: '/dashboard/profile', label: 'Perfil', icon: UserIcon },
  ];

  const handleLogout = () => {
    // Adiciona classe de animação de saída no body (opcional para efeito global)
    document.body.classList.add('ap-fade-out');
    
    setTimeout(() => {
      localStorage.removeItem('user');
      router.push('/login');
      document.body.classList.remove('ap-fade-out');
    }, 500);
  };

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
