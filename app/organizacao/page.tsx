"use client";

import { useEffect, useState } from "react";
import Header from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';

// Tipagem da organização
interface Organizacao {
  numero_organizacao: number;
  nome_organizacao: string;
}

const usuario = 'Elton';

export default function OrganizacaoPage() {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<{ numero_organizacao: number; nome_organizacao: string }>({
    numero_organizacao: 0,
    nome_organizacao: "",
  });
  const [menuAberto, setMenuAberto] = useState(false);
  
  // Busca os dados ao abrir a página
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizacao`)
      .then((res) => res.json())
      .then((data) => {
        setOrganizacoes(data);
        setLoading(false);
      });
  }, []);

  // Ao clicar em editar, carrega os dados no formulário
  function handleEditar(org: Organizacao) {
    setEditando(org.numero_organizacao);
    setForm({
      numero_organizacao: org.numero_organizacao,
      nome_organizacao: org.nome_organizacao,
    });
  }

  // Salva alterações (PUT)
  async function handleSalvar() {
    if (!form.numero_organizacao || !form.nome_organizacao) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizacao/${form.numero_organizacao}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_organizacao: form.nome_organizacao,
      }),
    });
    setOrganizacoes((orgs) =>
      orgs.map((org) =>
        org.numero_organizacao === form.numero_organizacao
          ? { ...org, nome_organizacao: form.nome_organizacao }
          : org
      )
    );
    setEditando(null);
    setForm({ numero_organizacao: 0, nome_organizacao: "" });
  }

  // Adiciona nova organização (POST)
  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.numero_organizacao || !form.nome_organizacao) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setOrganizacoes([...organizacoes, form]);
      setForm({ numero_organizacao: 0, nome_organizacao: "" });
    } else {
      alert("Erro ao adicionar. Verifique se o código já existe.");
    }
  }

  // Remove organização (DELETE)
  async function handleRemover(numero: number) {
    if (!window.confirm("Deseja remover esta organização?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizacao`, {
      method: "DELETE",
    });
    setOrganizacoes(organizacoes.filter((org) => org.numero_organizacao !== numero));
    if (editando === numero) setEditando(null);
  }

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Header usuario={usuario} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral
        aberto={menuAberto}
        usuario={usuario}
        onClose={() => setMenuAberto(false)}
      />
      <div style={{ height: 56 }} />

      {/* Título da página Organização */}
      <div style={{
        width: '100%',
        background: '#fff',
        padding: '1.2rem 0 0.5rem 0',
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 22,
        fontWeight: 600,
        color: '#2563eb',
        letterSpacing: 1
      }}>
        Organização
      </div>

      {/* Conteúdo principal */}
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
          {/* Formulário de adicionar/editar */}
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
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontWeight: 500, fontSize: 14 }}>Código</label>
              <input
                type="number"
                value={form.numero_organizacao || ""}
                onChange={(e) => setForm(f => ({ ...f, numero_organizacao: Number(e.target.value) }))}
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
                onChange={(e) => setForm(f => ({ ...f, nome_organizacao: e.target.value }))}
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
                onClick={() => { setEditando(null); setForm({ numero_organizacao: 0, nome_organizacao: "" }); }}
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

          {/* Lista */}
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
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>Código</th>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>Nome</th>
                <th style={{ padding: "10px 6px", fontWeight: 600, color: "#2563eb" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {organizacoes.map((org) => (
                <tr key={org.numero_organizacao} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>{org.numero_organizacao}</td>
                  <td style={{ padding: "8px 6px" }}>{org.nome_organizacao}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEditar(org)}
                      style={{
                        background: "#fbbf24",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.4rem 1rem",
                        fontWeight: 500,
                        fontSize: 15,
                        marginRight: 8,
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemover(org.numero_organizacao)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.4rem 1rem",
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {organizacoes.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                    Nenhuma organização cadastrada.
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