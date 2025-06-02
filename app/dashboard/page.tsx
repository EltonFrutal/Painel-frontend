'use client';

import { useState } from 'react';
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
} from "lucide-react";

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
  { titulo: 'Vendas',        cor: '#2563eb', icone: 'ShoppingCart' },
  { titulo: 'A Receber',     cor: '#22c55e', icone: 'DollarSign' },
  { titulo: 'A Pagar',       cor: '#ef4444', icone: 'CreditCard' },
  { titulo: 'Históricos',    cor: '#a21caf', icone: 'History' },
  { titulo: 'Estoque',       cor: '#0ea5e9', icone: 'Box' },
  { titulo: 'Compras',       cor: '#f59e42', icone: 'ShoppingBag' },
  { titulo: 'Resultados',    cor: '#16a34a', icone: 'BarChart2' },
  { titulo: 'Indicadores',   cor: '#fbbf24', icone: 'Gauge' },
];

export default function Dashboard() {
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = 'Elton';
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #dbeafe 100%)'
    }}>
      <Header usuario={usuario} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 80, // aumente aqui para descer as fileiras
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap: '3rem', // aumenta o espaço horizontal
            rowGap: '2rem',    // espaço vertical entre as linhas
            justifyItems: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 700,     // aumente se quiser mais espaço total
            padding: '0 1rem',
          }}
        >
          {botoes.map((botao) => {
            const Icon = icones[botao.icone];
            return (
              <div key={botao.titulo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  style={{
                    width: 96,
                    height: 96,
                    background: botao.cor,
                    border: 'none',
                    borderRadius: 16,
                    boxShadow: `0 2px 12px ${botao.cor}55`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    fontSize: 15
                  }}
                  onClick={() => alert(`Você clicou em ${botao.titulo}`)}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
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
                  {botao.titulo}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}