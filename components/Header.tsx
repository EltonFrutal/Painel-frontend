import { Menu, Home, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({
  usuario,
  organizacao,
  onMenuClick,
}: {
  usuario: string;
  organizacao?: string;
  onMenuClick: () => void;
}) {
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
          }}
          title="Início"
        >
          <Home size={26} />
        </button>
        <span
          className="hidden sm:inline"
          style={{
            color: "#fff",
            fontWeight: 400,
            fontSize: 20,
            letterSpacing: 1,
            marginLeft: 40,
          }}
        >
          Painel Gerencial
        </span>
        <div style={{ marginLeft: 24, color: "#fff", fontWeight: 500 }}>
          {usuario}
          {organizacao && (
            <div
              style={{
                fontSize: 13,
                color: "#dbeafe",
                fontWeight: 400,
                marginTop: 2,
              }}
            >
              {organizacao}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#fff",
            fontWeight: 500,
          }}
        >
          <User size={20} />
          <span>{usuario}</span>
        </div>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
          title="Logout"
        >
          <LogOut size={26} />
        </button>
      </div>
    </header>
  );
}

export async function handleLogin(
  e: React.FormEvent,
  form: { organizacao: string; usuario: string; senha: string },
  router: ReturnType<typeof useRouter>
) {
  e.preventDefault();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    console.error("A variável NEXT_PUBLIC_API_URL não está definida.");
    alert("Erro interno de configuração. Contate o administrador.");
    return;
  }

  try {
    // 1. Buscar organização pelo nome (singular: /organizacao?nome_organizacao=...)
    const nomeOrg = encodeURIComponent(form.organizacao.trim());
    const orgRes = await fetch(
      `${API_URL}/organizacao?nome_organizacao=${nomeOrg}`
    );
    if (!orgRes.ok) {
      throw new Error(`GET /organizacao retornou status ${orgRes.status}`);
    }
    const orgData = await orgRes.json();
    if (!Array.isArray(orgData) || orgData.length === 0) {
      alert("Organização não encontrada.");
      return;
    }
    const primeiraOrg = orgData[0];
    const id_organizacao = primeiraOrg.id_organizacao;

    // 2. Buscar usuário pelo nome e id_organizacao (singular: /usuarios?nome=...&id_organizacao=...)
    const nomeUser = encodeURIComponent(form.usuario.trim());
    const userRes = await fetch(
      `${API_URL}/usuarios?nome=${nomeUser}&id_organizacao=${id_organizacao}`
    );
    if (!userRes.ok) {
      throw new Error(`GET /usuarios retornou status ${userRes.status}`);
    }
    const userData = await userRes.json();
    if (!Array.isArray(userData) || userData.length === 0) {
      alert("Usuário não encontrado nesta organização.");
      return;
    }
    const primeiroUser = userData[0];

    // 3. Validar senha
    if (primeiroUser.senha !== form.senha) {
      alert("Senha incorreta.");
      return;
    }

    // 4. Login OK: salvar dados no localStorage e redirecionar
    localStorage.setItem("usuario", primeiroUser.nome);
    localStorage.setItem("organizacao", primeiraOrg.nome_organizacao);
    localStorage.setItem("id_organizacao", String(id_organizacao));
    router.push("/dashboard");
  } catch (error) {
    console.error("Erro durante o login:", error);
    alert("Falha ao realizar login. Veja o console para detalhes.");
  }
}