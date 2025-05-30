'use client';

import { useEffect, useState } from 'react';

type Venda = {
  id: number;
  numero_organizacao: number;
  nome_organizacao: string;
  data_emissao: string;
  valor_venda: number;
};

export default function Dashboard() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<string>('1111');

  useEffect(() => {
    if (!idEmpresa) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/vendas/${idEmpresa}`);
        const data: Venda[] = await response.json();
        setVendas(data);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
    };

    fetchData();
  }, [idEmpresa]);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Dashboard de Vendas</h1>
      <ul>
        {vendas.map((venda) => (
          <li key={venda.id}>
            {venda.nome_organizacao} - R$ {venda.valor_venda.toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}
