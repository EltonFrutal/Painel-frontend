"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Header from '../../../../components/Header';
import MenuLateral from '../../../../components/MenuLateral';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  id_organizacao: number;
}

const usuario = 'Elton';

export default function UsuariosPage() {
  const router = useRouter();
  const params = useParams();
  const id_organizacao = Number(params.id);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<{ nome: string; email: string }>({ nome: "", email: "" });
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios?id_organizacao=${id_organizacao}`)
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setLoading(false);
      });
  }, [id_organizacao]);

  function handleEditar(user: Usuario) {
    setEditando(user.id);
    setForm({ nome: user.nome, email: user.email });
  }

  async function handleSalvar() {
    if (!form.nome || !form.email) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${editando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    setUsuarios(users =>
      users.map(u =>
        u.id === editando ? { ...u, nome: form.nome, email: form.email } : u
      )
    );
    setEditando(null);
    setForm({ nome: "", email: "" });
  }

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.email) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id_organizacao }),
    });
    if (res.ok) {
      const novo = await res.json();
      setUsuarios([...usuarios, novo]);
      setForm({ nome: "", email: "" });
    } else {
      alert("Erro ao adicionar usuário.");
    }
  }

  async function handleRemover(id: number) {
    if (!window.confirm("Deseja remover este usuário?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, { method: "DELETE" });
    setUsuarios(usuarios.filter(u => u.id !== id));
    if (editando === id) setEditando(null);
  }

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Header usuario={usuario} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />
      <div style={{
        width: '100%',
        background: '#fff',
        padding: '1.2rem 0 0.5rem 0',
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 22,
        fontWeight: 600,
        color: '#2563eb',
        letterSpacing: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginRight: 8 }}>
          <ArrowLeft size={22} />
        </button>
        Usuários
      </div>
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        padding: '2rem 0'
      }}>
        <div style={{
          maxWidth: 540,
          width: '100%',
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0001",
          padding: "2rem"
        }}>
          <form
            onSubmit={editando ? (e) => { e.preventDefault(); handleSalvar(); } : handleAdicionar}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 28,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 2, minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: 14 }}>Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: 15,
                  marginTop: 2,
                }}
              />
            </div>
            <div style={{ flex: 2, minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: 14 }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: 15,
                  marginTop: 2,
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: editando ? "#22c55e" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 1.5rem",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                marginTop: 22,
              }}
            >
              {editando ? "Salvar" : "Adicionar"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => { setEditando(null); setForm({ nome: "", email: "" }); }}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.7rem 1.2rem",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  marginTop: 22,
                }}
              >
                Cancelar
              </button>
            )}
          </form>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#f9fafb",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#e0e7ef" }}>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>Nome</th>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>Email</th>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 6px" }}>{user.nome}</td>
                  <td style={{ padding: "8px 6px" }}>{user.email}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEditar(user)}
                      style={{
                        background: "none",
                        color: "#fbbf24",
                        border: "none",
                        borderRadius: 6,
                        padding: 4,
                        marginRight: 8,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleRemover(user.id)}
                      style={{
                        background: "none",
                        color: "#ef4444",
                        border: "none",
                        borderRadius: 6,
                        padding: 4,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Remover"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr key="no-users">
                  <td colSpan={3} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}