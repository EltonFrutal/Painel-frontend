'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';
import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  History,
  Box,
  ShoppingBag,
  BarChart2,
  Gauge
} from 'lucide-react';

const icones: Record<string, React.ElementType> = {
  ShoppingCart,
  DollarSign,
  CreditCard,
  History,
  Box,
  ShoppingBag,
  BarChart2,
  Gauge
};

const botoes = [
  { titulo: 'Vendas', cor: '#2563eb', icone: 'ShoppingCart' },
  { titulo: 'A Receber', cor: '#22c55e', icone: 'DollarSign' },
  { titulo: 'A Pagar', cor: '#ef4444', icone: 'CreditCard' },
  { titulo: 'Históricos', cor: '#a21caf', icone: 'History' },
  { titulo: 'Estoque', cor: '#0ea5e9', icone: 'Box' },
  { titulo: 'Compras', cor: '#f59e42', icone: 'ShoppingBag' },
  { titulo: 'Resultados', cor: '#16a34a', icone: 'BarChart2' },
  { titulo: 'Indicadores', cor: '#fbbf24', icone: 'Gauge' }
];

export default function Dashboard() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [organizacao, setOrganizacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    const org = localStorage.getItem('organizacao');
    setUsuario(user);
    setOrganizacao(org);
    setCarregando(false);
  }, []);

  const handleClick = (titulo: string) => {
    if (titulo === 'Vendas') {
      router.push('/dashboard/vendas');
    } else {
      alert(`Você clicou em ${titulo}`);
    }
  };

  if (carregando) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando dashboard...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #dbeafe 100%)'
    }}>
      <Header
        usuario={usuario || ''}
        organizacao={organizacao || ''}
        onMenuClick={() => setMenuAberto(true)}
      />
      <MenuLateral
        aberto={menuAberto}
        usuario={usuario || ''}
        onClose={() => setMenuAberto(false)}
      />
      <div style={{ height: 56 }} />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 80
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '2rem',
          justifyItems: 'center',
          width: '100%',
          maxWidth: 700,
          padding: '0 1rem'
        }}>
          {botoes.map(({ titulo, cor, icone }) => {
            const Icon = icones[icone];
            return (
              <div key={titulo} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <button
                  style={{
                    width: 96,
                    height: 96,
                    background: cor,
                    border: 'none',
                    borderRadius: 16,
                    boxShadow: `0 2px 12px ${cor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s'
                  }}
                  onClick={() => handleClick(titulo)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Icon size={36} color="#fff" strokeWidth={2.5} />
                </button>
                <span style={{
                  marginTop: 10,
                  color: '#222',
                  fontWeight: 400,
                  fontSize: 15,
                  textAlign: 'center'
                }}>
                  {titulo}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}