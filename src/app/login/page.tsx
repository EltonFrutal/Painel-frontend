'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://painel-backend-35hm.onrender.com', {
        usuario,
        senha
      });

      if (response.data.token || response.data.user) {
        // Simples: salva no localStorage
        localStorage.setItem('logado', 'true');
        router.push('/dashboard');
      } else {
        alert('Login inválido!');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar');
    }
  };

  return (
    <main className="p-8">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="border p-1 m-2"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="border p-1 m-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">Entrar</button>
    </main>
  );
}

