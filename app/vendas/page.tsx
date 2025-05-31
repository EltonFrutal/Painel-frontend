'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Vendas() {
  const [dados, setDados] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const anoSelecionado = searchParams.get('ano');
  const organizacao = searchParams.get('organizacao') || '';
  const empresa = searchParams.get('empresa') || '';

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/vendas?ano=${anoSelecionado || ''}&organizacao=${organizacao}&empresa=${empresa}`);
      const data = await response.json();
      console.log('Resposta da API:', data);

      if (Array.isArray(data)) {
        setDados(data);
      } else {
        console.error('Resposta não é um array:', data);
        setDados([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setDados([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [anoSelecionado, organizacao, empresa]);

  const meses = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
    'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <main style={{ padding: '2rem', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {anoSelecionado ? `Vendas Mensais de ${anoSelecionado}` : 'Vendas Anuais'}
      </h1>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div>
          <label>Organização:</label>
          <input
            type="text"
            defaultValue={organizacao}
            onChange={(e) => router.push(`/vendas?ano=${anoSelecionado || ''}&organizacao=${e.target.value}&empresa=${empresa}`)}
            placeholder="Digite a organização"
            style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
          />
        </div>
        <div>
          <label>Empresa:</label>
          <input
            type="text"
            defaultValue={empresa}
            onChange={(e) => router.push(`/vendas?ano=${anoSelecionado || ''}&organizacao=${organizacao}&empresa=${e.target.value}`)}
            placeholder="Digite a empresa"
            style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dados.map((item) => ({
            ...item,
            mes: item.mes ? meses[item.mes] : item.mes
          }))}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          onClick={(e) => {
            if (e && e.activeLabel && !anoSelecionado) {
              router.push(`/vendas?ano=${e.activeLabel}&organizacao=${organizacao}&empresa=${empresa}`);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={anoSelecionado ? 'mes' : 'ano'} stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      {anoSelecionado && (
        <button
          onClick={() => router.push(`/vendas?organizacao=${organizacao}&empresa=${empresa}`)}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Voltar para Vendas Anuais
        </button>
      )}
    </main>
  );
}
