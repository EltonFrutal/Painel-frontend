"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Users, Plus, Save, X, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../../components/Header";
import MenuLateral from "../../../../components/MenuLateral";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  id_organizacao: number;
}

export default function UsuariosPage() {
  const router = useRouter();
  const params = useParams();
  const id_organizacao = Number(params.id);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [organizacao, setOrganizacao] = useState<{ nome: string; nome_organizacao?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    const nome_usuario = localStorage.getItem("usuario");
    const id_organizacao_storage = localStorage.getItem("id_organizacao");

    if (!nome_usuario || !id_organizacao_storage) {
      router.push("/");
    } else {
      setUsuario(nome_usuario);
    }
  }, []);

  useEffect(() => {
    if (!id_organizacao || isNaN(id_organizacao)) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      if (!API_URL) {
        console.error("API_URL não definida");
        setLoading(false);
        return;
      }

      try {
        const [resUsers, resOrg] = await Promise.all([
          fetch(`${API_URL}/usuarios?id_organizacao=${id_organizacao}`),
          fetch(`${API_URL}/organizacao/${id_organizacao}`),
        ]);

        if (!resUsers.ok || !resOrg.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const usersData = await resUsers.json();
        const orgData = await resOrg.json();

        setUsuarios(Array.isArray(usersData) ? usersData : []);
        setOrganizacao(orgData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_organizacao]);

  function handleEditar(user: Usuario) {
    setEditando(user.id_usuario);
    setForm({ nome: user.nome, email: user.email, senha: "" });
  }

  async function handleSalvar() {
    if (!form.nome.trim() || !form.email.trim() || editando === null) return;

    try {
      const payload: any = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        id_organizacao,
      };
      if (form.senha.trim()) payload.senha = form.senha.trim();

      const res = await fetch(`${API_URL}/usuarios/${editando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar usuário");

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === editando ? { ...u, nome: form.nome.trim(), email: form.email.trim() } : u
        )
      );
      setEditando(null);
      setForm({ nome: "", email: "", senha: "" });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) return;

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id_organizacao }),
      });

      if (!res.ok) throw new Error("Erro ao adicionar usuário");

      const novo = await res.json();
      setUsuarios((prev) => [...prev, novo]);
      setForm({ nome: "", email: "", senha: "" });
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  }

  async function handleRemover(id: number) {
    if (!window.confirm("Deseja remover este usuário?")) return;

    try {
      const res = await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover");

      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      if (editando === id) {
        setEditando(null);
        setForm({ nome: "", email: "", senha: "" });
      }
    } catch (error) {
      console.error("Erro ao remover:", error);
    }
  }

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Carregando...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", color: "#111827", display: "flex", flexDirection: "column" }}>
      <Header usuario={usuario} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />

      <div
        style={{
          padding: "1.2rem 0 0.5rem 0",
          textAlign: "center",
          borderBottom: "1px solid #e5e7eb",
          fontSize: 22,
          fontWeight: 600,
          color: "#2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "#fff",
        }}
      >
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}>
          <ArrowLeft size={22} />
        </button>
        Usuários {organizacao ? `- ${organizacao.nome_organizacao || organizacao.nome || ""}` : ""}
      </div>

      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "2rem 0" }}>
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: "2rem",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editando !== null) {
                handleSalvar();
              } else {
                handleAdicionar(e);
              }
            }}
            style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-end" }}
          >
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder={editando !== null ? "Nova senha (opcional)" : "Senha"}
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required={editando === null}
              style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button
              type="submit"
              style={{ background: "#22c55e", border: "none", borderRadius: 8, padding: 10, color: "#fff", cursor: "pointer" }}
              title={editando !== null ? "Salvar" : "Adicionar"}
            >
              {editando !== null ? <Save size={18} /> : <Plus size={18} />}
            </button>
            {editando !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm({ nome: "", email: "", senha: "" });
                }}
                style={{ background: "#ef4444", border: "none", borderRadius: 8, padding: 10, color: "#fff", cursor: "pointer" }}
                title="Cancelar"
              >
                <X size={18} />
              </button>
            )}
          </form>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Nome</th>
                <th style={{ padding: 10, textAlign: "left" }}>Email</th>
                <th style={{ padding: 10, textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Nenhum usuário cadastrado.</td>
                </tr>
              ) : (
                usuarios.map((u, idx) => (
                  <tr key={u.id_usuario} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                    <td style={{ padding: 10 }}>{u.nome}</td>
                    <td style={{ padding: 10 }}>{u.email}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleEditar(u)}
                        style={{
                          background: "none",
                          border: "none",
                          marginRight: 8,
                          cursor: "pointer",
                        }}
                        title="Editar"
                      >
                        <Pencil size={18} color="#444" />
                      </button>
                      <button
                        onClick={() => handleRemover(u.id_usuario)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        title="Remover"
                      >
                        <Trash2 size={18} color="#444" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}