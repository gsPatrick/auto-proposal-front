import './globals.css';

export const metadata = {
  title: 'Auto-Proposal BI | Dashboard Inteligente',
  description: 'Métricas avançadas e controle de IA para propostas automáticas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
