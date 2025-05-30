'use client';

import { useRouter } from 'next/navigation';

const botoes = [
  { titulo: 'Vendas', link: '/vendas', icone: '🛍️' },
  { titulo: 'A Receber', link: '/areceber', icone: '💼' },
  { titulo: 'A Pagar', link: '/apagar', icone: '📂' },
  { titulo: 'Históricos', link: '/historicos', icone: '📊' },
  { titulo: 'Estoque', link: '/estoque', icone: '📦' },
  { titulo: 'Compras', link: '/compras', icone: '🛒' },
  { titulo: 'Resultados', link: '/resultados', icone: '📈' },
  { titulo: 'Indicadores', link: '/indicadores', icone: '📊' },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#111', color: '#fff' }}>
      {/* Menu Lateral */}
      <aside style={{ width: '200px', backgroundColor: '#222', padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Menu</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {botoes.map((btn) => (
            <li key={btn.titulo} style={{ margin: '0.5rem 0', cursor: 'pointer' }} onClick={() => router.push(btn.link)}>
              {btn.titulo}
            </li>
          ))}
        </ul>
      </aside>

      {/* Conteúdo */}
      <main style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
        {botoes.map((btn) => (
          <div
            key={btn.titulo}
            onClick={() => router.push(btn.link)}
            style={{
              backgroundColor: '#222',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{btn.icone}</div>
            <div>{btn.titulo}</div>
          </div>
        ))}
      </main>
    </div>
  );
}


