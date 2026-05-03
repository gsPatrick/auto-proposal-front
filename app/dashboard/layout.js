'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Enquanto verifica a autorização, não renderiza nada para evitar "piscar" o conteúdo
  if (!authorized) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#09090b',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        Verificando acesso...
      </div>
    );
  }

  return <>{children}</>;
}
