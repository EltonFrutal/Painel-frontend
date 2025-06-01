'use client';

import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  History,
  Box,
  ShoppingBag,
  BarChart2,
  Gauge,
  Menu,
  LogOut,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const usuario = 'Elton';

const botoes = [
  { titulo: 'Vendas',        cor: '#2563eb', icone: ShoppingCart },
  { titulo: 'A Receber',     cor: '#22c55e', icone: DollarSign },
  { titulo: 'A Pagar',       cor: '#ef4444', icone: CreditCard },
  { titulo: 'Históricos',    cor: '#a21caf', icone: History },
  { titulo: 'Estoque',       cor: '#0ea5e9', icone: Box },
  { titulo: 'Compras',       cor: '#f59e42', icone: ShoppingBag },
  { titulo: 'Resultados',    cor: '#16a34a', icone: BarChart2 },
  { titulo: 'Indicadores',   cor: '#fbbf24', icone: Gauge },
];

export default function Dashboard() {
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f3f4f6 0%, #dbeafe 100%)' }}>
      {/* Overlay para fechar o menu */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.2)',
            zIndex: 99,
          }}
        />
      )}

      {/* Header */}
      <header style={{
        width: '100%',
        height: 56,
        background: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 110,
        boxShadow: '0 2px 8px #2563eb33'
      }}>
        {/* Menu e título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setMenuAberto(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={28} />
          </button>
          <span style={{ color: '#fff', fontWeight: 400, fontSize: 20, letterSpacing: 1 }}>
            Painel Gerencial
          </span>
        </div>
        {/* Usuário e sair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 500 }}>
            <User size={20} />
            <span>{usuario}</span>
          </div>
          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <LogOut size={26} />
          </button>
        </div>
      </header>

      {/* Menu retrátil (agora começa abaixo da tarja azul) */}
      <div
        style={{
          position: 'fixed',
          top: 56, // começa abaixo do header
          left: menuAberto ? 0 : -260,
          width: 260,
          height: 'calc(100vh - 56px)',
          background: '#2563eb',
          color: '#fff',
          boxShadow: menuAberto ? '2px 0 8px #2563eb33' : 'none',
          zIndex: 105,
          transition: 'left 0.3s',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1rem 1rem 1rem',
        }}
      >
        {/* Usuário logado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <User size={22} />
          <span style={{ fontSize: 16 }}>{usuario}</span>
        </div>
        {/* Botão Dashboard */}
        <button
          onClick={() => { setMenuAberto(false); router.push('/dashboard'); }}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0.75rem 0',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <BarChart2 size={20} />
          Dashboard
        </button>
        {/* Botão Sair */}
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0.75rem 0',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            marginTop: 8
          }}
        >
          <LogOut size={20} />
          Sair
        </button>
        {/* Informações */}
        <div style={{
          marginTop: 'auto',
          fontSize: 13,
          color: '#e0e7ef',
          borderTop: '1px solid #3b82f6',
          paddingTop: 16
        }}>
          Desenvolvido por Consys Consultoria<br />
          34 99974-3931<br />
          Versão 1.0.0<br />
          Todos os direitos reservados
        </div>
      </div>

      {/* Espaço para compensar o header fixo */}
      <div style={{ height: 56 }} />

      {/* Conteúdo principal */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '2rem',
            justifyItems: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 520,
            padding: '0 1rem',
          }}
        >
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
    </div>
  );
}