'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario === 'Elton' && senha === '123456') {
      setSucesso(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } else {
      alert('Usuário ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #60a5fa 0%, #a7f3d0 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          padding: '2.5rem 2rem',
          width: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          alignItems: 'center'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #22d3ee 100%)',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8
        }}>
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" fill="#2563eb"/>
          </svg>
        </div>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#2563eb',
          margin: 0
        }}>Login de Usuário</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 16,
            outline: 'none',
            background: '#f3f4f6',
            color: '#222'
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 16,
            outline: 'none',
            background: '#f3f4f6',
            color: '#222'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(90deg, #2563eb 0%, #22d3ee 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #2563eb33'
          }}
        >
          Entrar
        </button>
        {sucesso && (
          <div style={{
            marginTop: 10,
            background: '#22c55e',
            color: '#fff',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px #22c55e33',
            transition: 'opacity 0.3s'
          }}>
            Login bem-sucedido! Redirecionando...
          </div>
        )}
      </form>
    </main>
  );
}


