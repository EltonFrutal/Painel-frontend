"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../../components/Header";
import MenuLateral from "../../../../components/MenuLateral";

// A variável de ambiente deve estar definida em .env.local:
// NEXT_PUBLIC_API_URL=https://painel-backend-35hm.onrender.com/api
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
  const [organizacao, setOrganizacao] = useState<{ nome: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<{ nome: string; email: string }>({ nome: "", email: "" });
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    // Se não houver um ID numérico válido, não faz nada
    if (!id_organizacao || isNaN(id_organizacao)) {
      setLoading(false);
      return;
    }

    // Função assíncrona que busca usuários e nome da organização em paralelo
    const fetchData = async () => {
      if (!API_URL) {
        console.error("NEXT_PUBLIC_API_URL não está definida.");
        setLoading(false);
        return;
      }

      try {
        // Executa as duas requisições em paralelo
        const [resUsers, resOrg] = await Promise.all([
          fetch(`${API_URL}/usuarios?id_organizacao=${id_organizacao}`),
          fetch(`${API_URL}/organizacao/${id_organizacao}`)
        ]);

        // Verifica se houve erro no fetch de usuários
        if (!resUsers.ok) {
          throw new Error(`Erro ao buscar usuários. Status: ${resUsers.status}`);
        }
        // Verifica se houve erro no fetch da organização
        if (!resOrg.ok) {
          throw new Error(`Erro ao buscar organização. Status: ${resOrg.status}`);
        }

        // Converte para JSON somente se os status estiverem OK
        const usersData: Usuario[] = await resUsers.json();
        const orgData: { nome: string } = await resOrg.json();

        setUsuarios(Array.isArray(usersData) ? usersData : []);
        setOrganizacao(orgData);
      } catch (error) {
        console.error("Falha ao carregar dados de usuários/organização:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_organizacao]);

  function handleEditar(user: Usuario) {
    setEditando(user.id_usuario);
    setForm({ nome: user.nome, email: user.email });
  }

  async function handleSalvar() {
    if (editando === null) return;
    if (!form.nome.trim() || !form.email.trim()) return;

    try {
      const res = await fetch(`${API_URL}/usuarios/${editando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: form.nome.trim(), email: form.email.trim() }),
      });

      if (!res.ok) {
        throw new Error(`PUT /usuarios/${editando} retornou status ${res.status}`);
      }

      // Atualiza localmente
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === editando
            ? { ...u, nome: form.nome.trim(), email: form.email.trim() }
            : u
        )
      );
      setEditando(null);
      setForm({ nome: "", email: "" });
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Falha ao salvar usuário. Veja o console para detalhes.");
    }
  }

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) return;

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: form.nome.trim(), email: form.email.trim(), id_organizacao }),
      });

      if (res.ok) {
        const novoUsuario: Usuario = await res.json();
        setUsuarios((prev) => [...prev, novoUsuario]);
        setForm({ nome: "", email: "" });
      } else {
        throw new Error(`POST /usuarios retornou status ${res.status}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      alert("Falha ao adicionar usuário. Veja o console para detalhes.");
    }
  }

  async function handleRemover(id_usuario: number) {
    if (!window.confirm("Deseja remover este usuário?")) return;

    try {
      const res = await fetch(`${API_URL}/usuarios/${id_usuario}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`DELETE /usuarios/${id_usuario} retornou status ${res.status}`);
      }

      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id_usuario));
      if (editando === id_usuario) {
        setEditando(null);
        setForm({ nome: "", email: "" });
      }
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      alert("Falha ao remover usuário. Veja o console para detalhes.");
    }
  }

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Carregando...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <Header usuario="Elton" onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario="Elton" onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />

      <div
        style={{
          width: "100%",
          background: "#fff",
          padding: "1.2rem 0 0.5rem 0",
          textAlign: "center",
          borderBottom: "1px solid #e5e7eb",
          fontSize: 22,
          fontWeight: 600,
          color: "#2563eb",
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}
          title="Voltar"
        >
          <ArrowLeft size={22} />
        </button>
        Usuários {organizacao ? `- ${organizacao.nome}` : ""}
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          padding: "2rem 0",
        }}
      >
        <div
          style={{
            maxWidth: 540,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: "2rem",
          }}
        >
          {/* Formulário de adicionar/editar usuário */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editando !== null ? handleSalvar() : handleAdicionar(e);
            }}
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
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
                background: editando !== null ? "#22c55e" : "#2563eb",
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
              {editando !== null ? "Salvar" : "Adicionar"}
            </button>
            {editando !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm({ nome: "", email: "" });
                }}
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

          {/* Tabela de usuários */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
            <thead>
              <tr style={{ background: "#f9fafb", height: 48 }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0 12px",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#374151",
                  }}
                >
                  Nome
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0 12px",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#374151",
                  }}
                >
                  Email
                </th>
                <th style={{ width: 100, textAlign: "center", padding: "0 12px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usuarios) && usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <tr
                    key={user.id_usuario}
                    style={{ borderBottom: "1px solid #e5e7eb", height: 56 }}
                  >
                    <td
                      style={{
                        padding: "0 12px",
                        fontSize: 15,
                        color: "#111827",
                      }}
                    >
                      {user.nome}
                    </td>
                    <td
                      style={{
                        padding: "0 12px",
                        fontSize: 15,
                        color: "#111827",
                      }}
                    >
                      {user.email}
                    </td>
                    <td style={{ textAlign: "center", padding: "0 12px" }}>
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
                          justifyContent: "center",
                        }}
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleRemover(user.id_usuario)}
                        style={{
                          background: "none",
                          color: "#ef4444",
                          border: "none",
                          borderRadius: 6,
                          padding: 4,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Remover"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      padding: 20,
                      color: "#888",
                    }}
                  >
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