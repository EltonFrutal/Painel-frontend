import { User, BarChart2, Building, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuLateral({ aberto, usuario, onClose }: { aberto: boolean, usuario: string, onClose: () => void }) {
  const router = useRouter();
  return (
    <div
      style={{
        position: 'fixed',
        top: 56,
        left: aberto ? 0 : -260,
        width: 260,
        height: 'calc(100vh - 56px)',
        background: '#60a5fa',
        color: '#fff',
        boxShadow: aberto ? '2px 0 8px #2563eb33' : 'none',
        zIndex: 105,
        transition: 'left 0.3s',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem 1rem 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <User size={22} />
        <span style={{ fontSize: 16 }}>{usuario}</span>
      </div>
      <button onClick={() => { onClose(); router.push('/dashboard'); }} style={menuBtnStyle}>
        <BarChart2 size={20} /> Dashboard
      </button>
      <button onClick={() => { onClose(); router.push('/organizacao'); }} style={menuBtnStyle}>
        <Building size={20} /> Organização
      </button>
      <button onClick={() => router.push('/')} style={{ ...menuBtnStyle, marginTop: 8 }}>
        <LogOut size={20} /> Sair
      </button>
      <div style={{
        marginTop: 'auto',
        fontSize: 13,
        color: '#e0e7ef',
        borderTop: '1px solid #3b82f6',
        paddingTop: 16
      }}>
        Desenvolvido por Consys Consultoria<br />
        34 99974-3931<br />
        Versão 1.0.0<br />
        Todos os direitos reservados
      </div>
    </div>
  );
}

const menuBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '0.75rem 0',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left' as const
};