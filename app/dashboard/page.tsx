'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, Wallet, FileText, BarChart3, Package, ShoppingBag, LineChart, GaugeCircle } from 'lucide-react';

const botoes = [
  { titulo: 'Vendas', link: '/vendas', icone: <ShoppingCart size={32} color="#4CAF50" /> },       // Verde
  { titulo: 'A Receber', link: '/areceber', icone: <Wallet size={32} color="#2196F3" /> },         // Azul
  { titulo: 'A Pagar', link: '/apagar', icone: <FileText size={32} color="#FF9800" /> },           // Laranja
  { titulo: 'Históricos', link: '/historicos', icone: <BarChart3 size={32} color="#9C27B0" /> },   // Roxo
  { titulo: 'Estoque', link: '/estoque', icone: <Package size={32} color="#FFC107" /> },           // Amarelo
  { titulo: 'Compras', link: '/compras', icone: <ShoppingBag size={32} color="#F44336" /> },       // Vermelho
  { titulo: 'Resultados', link: '/resultados', icone: <LineChart size={32} color="#00BCD4" /> },   // Azul claro
  { titulo: 'Indicadores', link: '/indicadores', icone: <GaugeCircle size={32} color="#E91E63" /> } // Rosa
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '200px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '3rem 3rem',
        justifyItems: 'center',
        alignItems: 'center',
      }}>
        {botoes.map((btn) => (
          <div
            key={btn.titulo}
            onClick={() => router.push(btn.link)}
            style={{
              backgroundColor: '#333', // Fundo mais claro
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
              width: '100px',
              fontSize: '0.75rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ marginBottom: '0.2rem' }}>{btn.icone}</div>
            <div>{btn.titulo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}










