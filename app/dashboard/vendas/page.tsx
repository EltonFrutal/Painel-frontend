// app/dashboard/vendas/page.tsx
'use client';

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList
} from "recharts";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import { Select } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const id_organizacao = 1111;

interface DadoAno {
  ano: number;
  total_venda: number;
}
interface DadoMes {
  mes: number;
  total_venda: number;
}
interface DadoDia {
  dia: number;
  total_venda: number;
}
type Dado = DadoAno | DadoMes | DadoDia;

export default function VendasPage() {
  const [nivel, setNivel] = useState<'ano' | 'mes' | 'dia'>('ano');
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  const [dados, setDados] = useState<Dado[]>([]);
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario] = useState("Elton");

  useEffect(() => {
    const buscarDados = async () => {
      let url = `${API_URL}/vendas/${nivel}?id_organizacao=${id_organizacao}`;
      if (anoSelecionado) url += `&ano=${anoSelecionado}`;
      if (mesSelecionado) url += `&mes=${mesSelecionado}`;
      if (tipo) url += `&tipo=${tipo}`;
      if (empresa) url += `&empresa=${empresa}`;

      try {
        const response = await fetch(url);
        const json = await response.json();
        setDados(json);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };

    buscarDados();
  }, [nivel, anoSelecionado, mesSelecionado, tipo, empresa]);

  const voltarNivel = () => {
    if (nivel === 'dia') {
      setNivel('mes');
    } else if (nivel === 'mes') {
      setNivel('ano');
      setAnoSelecionado(null);
    }
  };

  const handleBarClick = (entry: Dado) => {
    if ('ano' in entry && nivel === 'ano') {
      setAnoSelecionado(entry.ano);
      setNivel('mes');
    } else if ('mes' in entry && nivel === 'mes') {
      setMesSelecionado(entry.mes);
      setNivel('dia');
    }
  };

  const getLabelX = () => {
    return nivel === 'ano' ? 'ano' : nivel === 'mes' ? 'mes' : 'dia';
  };

  const getTitulo = () => {
    if (nivel === 'ano') return 'Vendas por Ano';
    if (nivel === 'mes') return `Vendas por Mês (${anoSelecionado})`;
    return `Vendas por Dia (${mesSelecionado}/${anoSelecionado})`;
  };

  const formatNumber = (n: number) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace('.0', '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.0', '') + 'K';
    return n.toLocaleString("pt-BR");
  };

  const maxValue = Math.max(...dados.map(d => d.total_venda || 0));
  const yMax = Math.ceil(maxValue * 1.1);
  const maxBarSize = nivel === 'mes' ? 80 : nivel === 'ano' ? 60 : 10;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header usuario={usuario} organizacao="SafetyCar" onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">{getTitulo()}</h1>
        <div className="flex gap-4 mb-6">
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTipo(e.target.value)}>
              <option value="">Todos</option>
              <option value="Venda">Venda</option>
              <option value="Servico">Serviço</option>
            </Select>
          </div>
          <div>
            <Label>Empresa</Label>
            <Select value={empresa} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmpresa(e.target.value)}>
              <option value="">Todas</option>
              <option value="Matriz">Matriz</option>
              <option value="Filial">Filial</option>
            </Select>
          </div>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0001",
          padding: 24,
          minHeight: 340
        }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={dados}
              onClick={({ activeTooltipIndex }) => {
                if (activeTooltipIndex != null) {
                  handleBarClick(dados[activeTooltipIndex]);
                }
              }}
              barCategoryGap={nivel === "dia" ? 2 : nivel === "mes" ? 10 : 30}
            >
              <XAxis
                dataKey={getLabelX()}
                axisLine={false}
                tickLine={false}
                style={{ fontWeight: 500, fontSize: 13, fill: '#222' }}
              />
              <YAxis dataKey="total_venda" domain={[0, yMax]} hide />
              <Bar
                dataKey="total_venda"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
                maxBarSize={maxBarSize}
                yAxisId={0}
              >
                <LabelList
                  dataKey="total_venda"
                  position="top"
                  formatter={formatNumber}
                  style={{ fill: '#222', fontWeight: 500, fontSize: 12 }}
                />
              </Bar>
              <Tooltip
                formatter={(v: number) => formatNumber(v)}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px #0001' }}
                cursor={{ fill: '#2563eb22' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {nivel !== "ano" && (
          <button
            className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm mt-4"
            onClick={voltarNivel}
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  );
}