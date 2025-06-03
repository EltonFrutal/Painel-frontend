import { Menu, Home, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ usuario, onMenuClick }: { usuario: string, onMenuClick: () => void }) {
  const router = useRouter();
  return (
    <header style={{
      width: '100%',
      height: 56,
      background: '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 110,
      boxShadow: '0 2px 8px #2563eb33'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            marginRight: 0
          }}
        >
          <Menu size={28} />
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: 0
          }}
          title="Início"
        >
          <Home size={26} />
        </button>
        <span
          className="hidden sm:inline"
          style={{
            color: '#fff',
            fontWeight: 400,
            fontSize: 20,
            letterSpacing: 1,
            marginLeft: 40,
          }}
        >
          Painel Gerencial
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 500 }}>
          <User size={20} />
          <span>{usuario}</span>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <LogOut size={26} />
        </button>
      </div>
    </header>
  );
}