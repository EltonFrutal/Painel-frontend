'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação simples: login correto é 'Elton' e '123456'
    if (usuario === 'Elton' && senha === '123456') {
      alert('Login bem-sucedido!');
      router.push('/dashboard');
    } else {
      alert('Usuário ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff' }}>
      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '300px',
          padding: '2rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: '#111',
          color: '#fff'
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <input
          type="text"
          placeholder="Digite seu usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '0.75rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Entrar
        </button>
      </form>
    </main>
  );
}


