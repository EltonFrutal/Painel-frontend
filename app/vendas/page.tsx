'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const dadosVendas = [
  { mes: 'Jan', vendas: 12000 },
  { mes: 'Fev', vendas: 9000 },
  { mes: 'Mar', vendas: 15000 },
  { mes: 'Abr', vendas: 11000 },
  { mes: 'Mai', vendas: 18000 },
  { mes: 'Jun', vendas: 13000 },
  { mes: 'Jul', vendas: 17000 },
  { mes: 'Ago', vendas: 14000 },
  { mes: 'Set', vendas: 16000 },
  { mes: 'Out', vendas: 20000 },
  { mes: 'Nov', vendas: 22000 },
  { mes: 'Dez', vendas: 25000 },
];

export default function Vendas() {
  return (
    <main style={{ padding: '2rem', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gráfico Anual de Vendas</h1>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosVendas} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="vendas" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}