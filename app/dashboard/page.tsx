'use client';

import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  History,
  Box,         // <-- Use o ícone Box (uma caixa só)
  ShoppingBag,
  BarChart2,
  Gauge
} from 'lucide-react';

const botoes = [
  { titulo: 'Vendas',        cor: '#2563eb', icone: ShoppingCart },
  { titulo: 'A Receber',     cor: '#22c55e', icone: DollarSign },
  { titulo: 'A Pagar',       cor: '#ef4444', icone: CreditCard },
  { titulo: 'Históricos',    cor: '#a21caf', icone: History },
  { titulo: 'Estoque',       cor: '#0ea5e9', icone: Box },           // <-- Agora usa Box
  { titulo: 'Compras',       cor: '#f59e42', icone: ShoppingBag },
  { titulo: 'Resultados',    cor: '#16a34a', icone: BarChart2 },
  { titulo: 'Indicadores',   cor: '#fbbf24', icone: Gauge },
];

export default function Dashboard() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #dbeafe 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
        justifyItems: 'center',
        alignItems: 'center',
        width: 520,
        maxWidth: '90vw'
      }}>
        {botoes.map((botao) => {
          const Icon = botao.icone;
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
  );
}