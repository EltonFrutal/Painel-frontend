'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, YAxis } from 'recharts';

// Função para formatar números em K, M, B
function formatNumber(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

type Venda = {
  total: number;
  mes?: number;
  ano?: number;
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length && payload[0]?.value !== undefined) {
    return (
      <div style={{
        background: '#222',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
        fontSize: 14
      }}>
        <strong>{label}</strong>
        <br />
        Total: <span style={{ color: '#82ca9d', fontWeight: 600 }}>{formatNumber(payload[0].value)}</span>
      </div>
    );
  }
  return null;
};

export default function Vendas() {
  const [dados, setDados] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const anoSelecionado = searchParams.get('ano');
  const organizacao = searchParams.get('organizacao') || '';
  const empresa = searchParams.get('empresa') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (anoSelecionado) params.append('ano', anoSelecionado);
      if (organizacao) params.append('organizacao', organizacao);
      if (empresa) params.append('empresa', empresa);

      const response = await fetch(`/api/vendas?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setDados(data);
      } else {
        console.warn('Dados recebidos não são um array:', data);
        setDados([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [anoSelecionado, organizacao, empresa]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const meses = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
    'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const maxValor = Math.max(...dados.map(item => item.total || 0), 0);

  // Processa os dados para o gráfico
  const dadosProcessados = dados.map(item => ({
    ...item,
    mes: item.mes ? meses[item.mes] : item.ano?.toString() || '',
    displayValue: anoSelecionado ? (item.mes ? meses[item.mes] : '') : item.ano?.toString()
  }));

  const handleBarClick = useCallback((data: any) => {
    if (data && data.activeLabel && !anoSelecionado) {
      const params = new URLSearchParams();
      params.append('ano', data.activeLabel);
      if (organizacao) params.append('organizacao', organizacao);
      if (empresa) params.append('empresa', empresa);
      
      router.push(`/vendas?${params.toString()}`);
    }
  }, [anoSelecionado, organizacao, empresa, router]);

  const handleBackToAnnual = useCallback(() => {
    const params = new URLSearchParams();
    if (organizacao) params.append('organizacao', organizacao);
    if (empresa) params.append('empresa', empresa);
    
    router.push(`/vendas?${params.toString()}`);
  }, [organizacao, empresa, router]);

  const handleBackToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <main style={{ padding: '2rem', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <button
        onClick={handleBackToDashboard}
        style={{
          marginBottom: '1.5rem',
          padding: '0.5rem 1.2rem',
          background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
        title="Voltar para o Dashboard"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M3 12L12 4l9 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v10h14V10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Dashboard
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {anoSelecionado ? `Vendas Mensais de ${anoSelecionado}` : 'Vendas Anuais'}
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
          padding: '1.5rem',
          minHeight: 336,
          minWidth: 0,
          position: 'relative'
        }}>
          {anoSelecionado && (
            <button
              onClick={handleBackToAnnual}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4
              }}
              title="Voltar para gráfico anual"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#222" opacity="0.7" />
                <path d="M15 7l-5 5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 280,
              color: '#888' 
            }}>
              Carregando dados...
            </div>
          ) : dadosProcessados.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 280,
              color: '#888' 
            }}>
              Nenhum dado encontrado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={dadosProcessados}
                margin={{ top: 16, right: 24, left: 0, bottom: 5 }}
                onClick={handleBarClick}
              >
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={anoSelecionado ? "#22c55e" : "#3b82f6"} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={anoSelecionado ? "#166534" : "#1e3a8a"} stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="2 6" stroke="#333" />
                <XAxis 
                  dataKey={anoSelecionado ? 'mes' : 'ano'} 
                  stroke="#aaa" 
                  tick={{ fontSize: 13 }} 
                />
                <YAxis
                  domain={[0, maxValor ? Math.ceil(maxValor * 1.2) : 1]}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  width={0}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="total"
                  fill="url(#colorBar)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                  animationDuration={900}
                >
                  <LabelList
                    dataKey="total"
                    position="top"
                    formatter={formatNumber}
                    style={{
                      fill: '#fff',
                      fontWeight: 400,
                      fontSize: 11,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 1)'
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
            padding: '1.5rem',
            minHeight: 336,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#888', fontSize: 18 }}>Sem dados</span>
          </div>
        ))}
      </div>
    </main>
  );
}