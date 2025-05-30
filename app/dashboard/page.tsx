'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type Venda = {
  id: number;
  numero_organizacao: number;
  nome_organizacao: string;
  data_emissao: string;
  valor_venda: number;
};

export default function Dashboard() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [idEmpresa, setIdEmpresa] = useState('1111');

  useEffect(() => {
    if (!idEmpresa) return;

    axios.get(`https://painel-backend-35hm.onrender.com/vendas/${idEmpresa}`)
      .then(response => {
        const dados = response.data;

        // Agrupar por ano
        const agrupadoPorAno = dados.reduce((acc: any, venda: any) => {
          const ano = new Date(venda.data_emissao).getFullYear();
          if (!acc[ano]) {
            acc[ano] = { ano, total: 0 };
          }
          acc[ano].total += Number(venda.valor_venda);
          return acc;
        }, {});

        const resultado = Object.values(agrupadoPorAno);
        setVendas(resultado);
      })
      .catch(error => console.error(error));
  }, [idEmpresa]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Painel Gerencial</h1>

      <div className="mb-4">
        <label className="mr-2">ID da Organização:</label>
        <input
          type="text"
          value={idEmpresa}
          onChange={(e) => setIdEmpresa(e.target.value)}
          className="border p-1"
        />
      </div>

      <BarChart width={600} height={300} data={vendas}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="ano" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>

      <table className="mt-8 border border-gray-300">
        <thead>
          <tr>
            <th>Ano</th>
            <th>Total Vendas</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr key={venda.ano}>
              <td>{venda.ano}</td>
              <td>{venda.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
