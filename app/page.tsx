'use client';

import { useState, useEffect, InputHTMLAttributes, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, Lock, Eye, EyeOff } from 'lucide-react';

interface Organizacao {
  id_organizacao: number;
  nome_organizacao: string;
}

export default function Home() {
  const [aba, setAba] = useState<'usuario' | 'assessor'>('usuario');
  const [form, setForm] = useState({ usuario: '', organizacao: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizacao`)
      .then(res => res.json())
      .then(data => setOrganizacoes(data))
      .catch(() => setMensagem('Erro ao carregar organizações.'));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');

    if (aba === 'usuario') {
      const orgSelecionada = organizacoes.find(o => o.nome_organizacao === form.organizacao);
      if (!orgSelecionada) {
        setMensagem('Organização inválida.');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: form.usuario,
            senha: form.senha,
            id_organizacao: orgSelecionada.id_organizacao,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMensagem(data.erro || 'Usuário ou senha inválidos.');
        } else {
          localStorage.setItem('usuario', data.user.nome);
          localStorage.setItem('organizacao', orgSelecionada.nome_organizacao);
          localStorage.setItem('id_organizacao', String(orgSelecionada.id_organizacao));
          router.push('/dashboard');
        }
      } catch {
        setMensagem('Erro ao conectar com o servidor.');
      }
    } else {
      if (form.usuario === 'Assessor' && form.senha === '654321') {
        router.push('/dashboard');
      } else {
        setMensagem('Usuário ou senha de assessor inválidos.');
      }
    }
  }

  function renderInput(icon: ReactNode, props: InputHTMLAttributes<HTMLInputElement>) {
    return (
      <div style={{ position: 'relative', width: '100%', marginBottom: 2 }}>
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#2563eb',
            pointerEvents: 'none',
          }}
        >
          {icon}
        </span>
        <input
          {...props}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem 0.6rem 2.2rem',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 15,
            outline: 'none',
            background: '#f3f4f6',
            color: '#222',
            ...props.style,
          }}
        />
        {props.type === 'password' && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setMostrarSenha((v) => !v)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#2563eb',
              padding: 0,
            }}
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #60a5fa 0%, #a7f3d0 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          padding: '2rem 1.2rem',
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #22d3ee 100%)',
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
          }}
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2" />
            <path
              d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"
              fill="#2563eb"
            />
          </svg>
        </div>

        <div style={{ display: 'flex', width: '100%', marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => {
              setAba('usuario');
              setForm({ usuario: '', organizacao: '', senha: '' });
            }}
            style={{
              flex: 1,
              padding: '0.5rem 0',
              border: 'none',
              background: aba === 'usuario' ? '#2563eb' : '#e5e7eb',
              color: aba === 'usuario' ? '#fff' : '#222',
              fontWeight: 600,
              borderRadius: '8px 0 0 8px',
              cursor: 'pointer',
            }}
          >
            Usuário
          </button>
          <button
            type="button"
            onClick={() => {
              setAba('assessor');
              setForm({ usuario: '', organizacao: '', senha: '' });
            }}
            style={{
              flex: 1,
              padding: '0.5rem 0',
              border: 'none',
              background: aba === 'assessor' ? '#2563eb' : '#e5e7eb',
              color: aba === 'assessor' ? '#fff' : '#222',
              fontWeight: 600,
              borderRadius: '0 8px 8px 0',
              cursor: 'pointer',
            }}
          >
            Assessor
          </button>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', margin: 0 }}>
          Login {aba === 'usuario' ? 'de Usuário' : 'de Assessor'}
        </h1>

        <div style={{ position: 'relative', width: '100%', marginBottom: 2 }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#2563eb',
              pointerEvents: 'none',
            }}
          >
            <Building2 size={18} />
          </span>
          <select
            name="organizacao"
            value={form.organizacao}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.2rem',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 15,
              outline: 'none',
              background: '#f3f4f6',
              color: '#222',
              appearance: 'none',
            }}
          >
            <option value="">Selecione a organização</option>
            {organizacoes.map((org) => (
              <option key={org.id_organizacao} value={org.nome_organizacao}>
                {org.nome_organizacao}
              </option>
            ))}
          </select>
        </div>

        {form.organizacao && (
          <>
            {renderInput(<User size={18} />, {
              type: 'text',
              name: 'usuario',
              value: form.usuario,
              onChange: handleChange,
              required: true,
              placeholder: 'Usuário',
            })}

            {renderInput(<Lock size={18} />, {
              type: mostrarSenha ? 'text' : 'password',
              name: 'senha',
              value: form.senha,
              onChange: handleChange,
              required: true,
              placeholder: 'Senha',
            })}
          </>
        )}

        {mensagem && (
          <div style={{ fontSize: 14, color: 'red', marginTop: -8 }}>{mensagem}</div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.6rem',
            background: 'linear-gradient(90deg, #2563eb 0%, #22d3ee 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #2563eb33',
          }}
        >
          Entrar
        </button>
      </form>
    </main>
  );
}