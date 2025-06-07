'use client';

import { Menu, Home, User, LogOut, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  usuario: string;
  organizacao?: string;
  onMenuClick: () => void;
}

export default function Header({ usuario, organizacao, onMenuClick }: HeaderProps) {
  const router = useRouter();

  return (
    <header
      style={{
        width: "100%",
        height: 56,
        background: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 110,
        boxShadow: "0 2px 8px #2563eb33",
      }}
    >
      {/* Lado esquerdo: menu, home e título */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            marginRight: 0,
          }}
          title="Abrir menu"
        >
          <Menu size={28} />
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            padding: 0,
            marginLeft: 8,
          }}
          title="Início"
        >
          <Home size={26} />
        </button>

        <span
          style={{
            color: "#fff",
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: 1,
            marginLeft: 32,
          }}
        >
          Painel Gerencial
        </span>
      </div>

      {/* Lado direito: usuário, organização e sair */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Usuário logado */}
        <div style={{ display: "flex", alignItems: "center", color: "#fff", fontWeight: 500 }}>
          <User size={20} style={{ marginRight: 6 }} />
          <span>{usuario}</span>
        </div>

        {/* Organização logada */}
        {organizacao && (
          <div
            style={{
              background: "#1e40af",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 13,
              color: "#dbeafe",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
            }}
            title="Organização logada"
          >
            <Building2 size={16} style={{ marginRight: 6 }} />
            {organizacao}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
          title="Sair"
        >
          <LogOut size={26} />
        </button>
      </div>
    </header>
  );
}