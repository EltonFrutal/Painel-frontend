"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import MenuLateral from "../../components/MenuLateral";

// Certifique-se de que, em .env.local, exista:
// NEXT_PUBLIC_API_URL=https://painel-backend-35hm.onrender.com/api
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Organizacao {
  id_organizacao: number;
  nome_organizacao: string;
}

const usuario = "Elton";

export default function OrganizacaoPage() {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<{ id_organizacao: number; nome_organizacao: string }>({
    id_organizacao: 0,
    nome_organizacao: "",
  });
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!API_URL) {
      console.error("A variável NEXT_PUBLIC_API_URL não está definida.");
      setLoading(false);
      return;
    }

    const fetchOrganizacoes = async () => {
      try {
        const res = await fetch(`${API_URL}/organizacao`);
        if (!res.ok) {
          throw new Error(`GET /organizacao retornou status ${res.status}`);
        }
        const data: Organizacao[] = await res.json();
        setOrganizacoes(data);
      } catch (error) {
        console.error("Falha ao carregar organizações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizacoes();
  }, []);

  function handleEditar(org: Organizacao) {
    setEditando(org.id_organizacao);
    setForm({
      id_organizacao: org.id_organizacao,
      nome_organizacao: org.nome_organizacao,
    });
  }

  async function handleSalvar() {
    if (!form.id_organizacao || !form.nome_organizacao.trim()) return;

    try {
      const res = await fetch(`${API_URL}/organizacao/${form.id_organizacao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_organizacao: form.nome_organizacao.trim() }),
      });

      if (!res.ok) {
        throw new Error(`PUT /organizacao/${form.id_organizacao} retornou status ${res.status}`);
      }

      setOrganizacoes((orgs) =>
        orgs.map((org) =>
          org.id_organizacao === form.id_organizacao
            ? { ...org, nome_organizacao: form.nome_organizacao.trim() }
            : org
        )
      );
      setEditando(null);
      setForm({ id_organizacao: 0, nome_organizacao: "" });
    } catch (error) {
      console.error("Erro ao salvar organização:", error);
      alert("Falha ao salvar. Confira o console para mais detalhes.");
    }
  }

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id_organizacao || !form.nome_organizacao.trim()) return;

    try {
      const res = await fetch(`${API_URL}/organizacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_organizacao: form.id_organizacao,
          nome_organizacao: form.nome_organizacao.trim(),
        }),
      });

      if (res.ok) {
        const novaOrg: Organizacao = await res.json();
        setOrganizacoes((prev) => [...prev, novaOrg]);
        setForm({ id_organizacao: 0, nome_organizacao: "" });
      } else if (res.status === 409) {
        alert("Erro: já existe uma organização com esse código.");
      } else {
        throw new Error(`POST /organizacao retornou status ${res.status}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar organização:", error);
      alert("Falha ao adicionar. Confira o console para mais detalhes.");
    }
  }

  async function handleRemover(id: number) {
    if (!window.confirm("Deseja realmente remover esta organização?")) return;

    try {
      const res = await fetch(`${API_URL}/organizacao/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`DELETE /organizacao/${id} retornou status ${res.status}`);
      }
      setOrganizacoes((prev) => prev.filter((org) => org.id_organizacao !== id));
      if (editando === id) {
        setEditando(null);
        setForm({ id_organizacao: 0, nome_organizacao: "" });
      }
    } catch (error) {
      console.error("Erro ao remover organização:", error);
      alert("Falha ao remover. Confira o console para mais detalhes.");
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Carregando organizações...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <Header usuario={usuario} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
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
        }}
      >
        Organização
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editando ? handleSalvar() : handleAdicionar(e);
            }}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 28,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontWeight: 500, fontSize: 14 }}>Código</label>
              <input
                type="number"
                value={form.id_organizacao || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, id_organizacao: Number(e.target.value) }))
                }
                disabled={!!editando}
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
              <label style={{ fontWeight: 500, fontSize: 14 }}>Nome</label>
              <input
                type="text"
                value={form.nome_organizacao}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome_organizacao: e.target.value }))
                }
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
                onClick={() => {
                  setEditando(null);
                  setForm({ id_organizacao: 0, nome_organizacao: "" });
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
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>
                  Código
                </th>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>
                  Nome
                </th>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {organizacoes.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                    Nenhuma organização cadastrada.
                  </td>
                </tr>
              )}

              {organizacoes.map((org) => (
                <tr key={org.id_organizacao}>
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>
                    {org.id_organizacao}
                  </td>
                  <td style={{ padding: "8px 6px" }}>{org.nome_organizacao}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>
                    <button
                      onClick={() => router.push(`/organizacao/${org.id_organizacao}/usuarios`)}
                      style={{
                        background: "none",
                        color: "#2563eb",
                        border: "none",
                        borderRadius: 6,
                        padding: 4,
                        marginRight: 8,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Usuários"
                    >
                      <Users size={18} />
                    </button>

                    <button
                      onClick={() => handleEditar(org)}
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
                      onClick={() => handleRemover(org.id_organizacao)}
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}