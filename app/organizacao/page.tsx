"use client";

import { Pencil, Trash2, Users, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import MenuLateral from "../../components/MenuLateral";

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
  const [form, setForm] = useState({ id_organizacao: 0, nome_organizacao: "" });
  const [menuAberto, setMenuAberto] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [colunaOrdenada, setColunaOrdenada] = useState<"id" | "nome">("id");
  const [ordemAscendente, setOrdemAscendente] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!API_URL) {
      console.error("API_URL não está definida.");
      setLoading(false);
      return;
    }

    const fetchOrganizacoes = async () => {
      try {
        const res = await fetch(`${API_URL}/organizacao`);
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        const data: Organizacao[] = await res.json();
        setOrganizacoes(data);
      } catch (error) {
        console.error("Erro ao buscar organizações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizacoes();
  }, []);

  function mostrarMensagem(texto: string) {
    setMensagem(texto);
    setTimeout(() => setMensagem(null), 3000);
  }

  function handleEditar(org: Organizacao) {
    setEditando(org.id_organizacao);
    setForm({ id_organizacao: org.id_organizacao, nome_organizacao: org.nome_organizacao });
  }

  async function handleSalvar() {
    if (!form.id_organizacao || !form.nome_organizacao.trim()) return;

    try {
      const res = await fetch(`${API_URL}/organizacao/${form.id_organizacao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_organizacao: form.nome_organizacao.trim() }),
      });

      if (!res.ok) throw new Error(`PUT falhou: ${res.status}`);

      setOrganizacoes((prev) =>
        prev.map((org) =>
          org.id_organizacao === form.id_organizacao ? { ...org, nome_organizacao: form.nome_organizacao.trim() } : org
        )
      );

      setEditando(null);
      setForm({ id_organizacao: 0, nome_organizacao: "" });
      mostrarMensagem("Organização atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar organização.");
    }
  }

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id_organizacao || !form.nome_organizacao.trim()) return;

    try {
      const res = await fetch(`${API_URL}/organizacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const novaOrg: Organizacao = await res.json();
        setOrganizacoes((prev) => [...prev, novaOrg]);
        setForm({ id_organizacao: 0, nome_organizacao: "" });
        mostrarMensagem("Organização adicionada com sucesso!");
      } else if (res.status === 409) {
        alert("Código já existente.");
      } else {
        throw new Error(`POST falhou: ${res.status}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao adicionar organização.");
    }
  }

  async function handleRemover(id: number) {
    if (!window.confirm("Deseja remover esta organização?")) return;

    try {
      const res = await fetch(`${API_URL}/organizacao/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`DELETE falhou: ${res.status}`);

      setOrganizacoes((prev) => prev.filter((org) => org.id_organizacao !== id));
      if (editando === id) {
        setEditando(null);
        setForm({ id_organizacao: 0, nome_organizacao: "" });
      }
      mostrarMensagem("Organização removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover:", error);
      alert("Erro ao remover organização.");
    }
  }

  const organizacoesFiltradas = organizacoes
    .filter((org) => org.nome_organizacao.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => {
      const campoA = colunaOrdenada === "id" ? a.id_organizacao : a.nome_organizacao.toLowerCase();
      const campoB = colunaOrdenada === "id" ? b.id_organizacao : b.nome_organizacao.toLowerCase();
      if (campoA < campoB) return ordemAscendente ? -1 : 1;
      if (campoA > campoB) return ordemAscendente ? 1 : -1;
      return 0;
    });

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Carregando organizações...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", color: "#111827", display: "flex", flexDirection: "column" }}>
      <Header usuario={usuario} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />

      <div style={{ padding: "1.2rem 0 0.5rem 0", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: 22, fontWeight: 600, color: "#2563eb" }}>
        Organização
      </div>

      {mensagem && <div style={{ textAlign: "center", padding: 10, background: "#e0f7e9", color: "#065f46", fontWeight: 500 }}>{mensagem}</div>}

      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "2rem 0" }}>
        <div style={{ maxWidth: 600, width: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0001", padding: "2rem" }}>

          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ marginBottom: 20, padding: "0.6rem", width: "100%", borderRadius: 8, border: "1px solid #ccc" }}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editando !== null) {
                handleSalvar();
              } else {
                handleAdicionar(e);
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "0 0 80px", minWidth: 80 }}>
                <label style={{ fontWeight: 600 }}>Código</label>
                <input
                  type="number"
                  value={form.id_organizacao || ""}
                  onChange={(e) => setForm((f) => ({ ...f, id_organizacao: Number(e.target.value) }))}
                  disabled={editando !== null}
                  required
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #ccc", borderRadius: 8 }}
                />
              </div>
              <div style={{ flex: 2, minWidth: 180, display: "flex", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600 }}>Nome</label>
                  <input
                    type="text"
                    value={form.nome_organizacao}
                    onChange={(e) => setForm((f) => ({ ...f, nome_organizacao: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.6rem", border: "1px solid #ccc", borderRadius: 8 }}
                  />
                </div>
                {/* Botões de ação ao lado do campo nome */}
                <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                  {editando !== null ? (
                    <>
                      <button
                        type="submit"
                        title="Salvar"
                        style={{
                          background: "#2563eb",
                          border: "none",
                          borderRadius: 8,
                          padding: 6,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          boxShadow: "0 1px 4px #2563eb22"
                        }}
                      >
                        <Save size={20} color="#fff" />
                      </button>
                      <button
                        type="button"
                        title="Cancelar"
                        onClick={() => {
                          setEditando(null);
                          setForm({ id_organizacao: 0, nome_organizacao: "" });
                        }}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: 8,
                          padding: 6,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          boxShadow: "0 1px 4px #ef444422"
                        }}
                      >
                        <X size={20} color="#fff" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      title="Adicionar"
                      style={{
                        background: "#22c55e",
                        border: "none",
                        borderRadius: 8,
                        padding: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: "0 1px 4px #22c55e22"
                      }}
                    >
                      <Plus size={20} color="#fff" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th
                  style={{ padding: "10px", textAlign: "left", cursor: "pointer" }}
                  onClick={() => {
                    setColunaOrdenada("id");
                    setOrdemAscendente((prev) => colunaOrdenada === "id" ? !prev : true);
                  }}
                >
                  Código {colunaOrdenada === "id" ? (ordemAscendente ? "▲" : "▼") : ""}
                </th>
                <th
                  style={{ padding: "10px", textAlign: "left", cursor: "pointer" }}
                  onClick={() => {
                    setColunaOrdenada("nome");
                    setOrdemAscendente((prev) => colunaOrdenada === "nome" ? !prev : true);
                  }}
                >
                  Nome {colunaOrdenada === "nome" ? (ordemAscendente ? "▲" : "▼") : ""}
                </th>
                <th style={{ padding: "10px", textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {organizacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Nenhuma organização encontrada.</td>
                </tr>
              ) : (
                organizacoesFiltradas.map((org, idx) => (
                  <tr
                    key={org.id_organizacao}
                    style={{
                      borderBottom: "1px solid #e5e7eb", // linha separadora
                      background: idx % 2 === 0 ? "#fff" : "#f9fafb" // opcional: zebra
                    }}
                  >
                    <td style={{ padding: "8px" }}>{org.id_organizacao}</td>
                    <td style={{ padding: "8px" }}>{org.nome_organizacao}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => router.push(`/organizacao/${org.id_organizacao}/usuarios`)}
                        title="Usuários"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 4,
                          margin: "0 8px",
                          cursor: "pointer"
                        }}
                      >
                        <Users size={18} color="#444" />
                      </button>
                      <button
                        onClick={() => handleEditar(org)}
                        title="Editar"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 4,
                          margin: "0 8px",
                          cursor: "pointer"
                        }}
                      >
                        <Pencil size={18} color="#444" />
                      </button>
                      <button
                        onClick={() => handleRemover(org.id_organizacao)}
                        title="Remover"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 4,
                          margin: "0 8px",
                          cursor: "pointer"
                        }}
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