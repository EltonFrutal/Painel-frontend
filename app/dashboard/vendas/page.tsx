"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import { Select } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { ArrowLeft } from "lucide-react"; // troque ChevronLeft por ArrowLeft

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const id_organizacao = 1111;

export default function VendasPage() {
  const [nivel, setNivel] = useState<"ano" | "mes" | "dia">("ano");
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  const [dados, setDados] = useState<any[]>([]);
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario] = useState("Elton");

  const buscarDados = async () => {
    let url = `${API_URL}/vendas/${nivel}?id_organizacao=${id_organizacao}`;
    if (anoSelecionado) url += `&ano=${anoSelecionado}`;
    if (mesSelecionado) url += `&mes=${mesSelecionado}`;
    if (tipo) url += `&tipo=${tipo}`;
    if (empresa) url += `&empresa=${empresa}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      setDados(json);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  useEffect(() => {
    buscarDados();
  }, [nivel, anoSelecionado, mesSelecionado, tipo, empresa]);

  const voltarNivel = () => {
    if (nivel === "dia") {
      setNivel("mes");
      setMesSelecionado(null);
    } else if (nivel === "mes") {
      setNivel("ano");
      setAnoSelecionado(null);
    }
  };

  const handleBarClick = (entry: any) => {
    if (nivel === "ano") {
      setAnoSelecionado(entry.ano);
      setNivel("mes");
    } else if (nivel === "mes") {
      setMesSelecionado(entry.mes);
      setNivel("dia");
    }
  };

  const getLabelX = () => {
    if (nivel === "ano") return "ano";
    if (nivel === "mes") return "mes";
    return "dia";
  };

  const getTitulo = () => {
    if (nivel === "ano") return "Vendas por Ano";
    if (nivel === "mes") return `Vendas por Mês (${anoSelecionado})`;
    return `Vendas por Dia (${mesSelecionado}/${anoSelecionado})`;
  };

  // Função para formatar valores K, M, B
  function formatNumber(n: number) {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace('.0', '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.0', '') + 'K';
    return n.toLocaleString("pt-BR");
  }

  const maxValue = Math.max(...dados.map(d => d.total_venda || 0));
  const yMax = Math.ceil(maxValue * 1.1);

  // Defina um tamanho máximo e mínimo para as barras
  const barMax = 120;
  const barMin = 8; // diminua o mínimo para permitir barras bem finas

  // maxBarSize adaptativo: valores ideais para cada nível
  const maxBarSize =
    nivel === "mes" ? 80 :
    nivel === "ano" ? 60 :
    nivel === "dia" ? 10 : // bem fino para o diário
    Math.max(barMin, Math.min(barMax, Math.floor(180 / dados.length)));

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

        <div className="grid gap-6" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 24 }}>
          {/* Gráfico 1 (já existente) */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: 24,
            minHeight: 340,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative"
          }}>
            {nivel === "mes" && (
              <button
                onClick={voltarNivel}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "#2563eb",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #2563eb33",
                  zIndex: 2,
                  transition: "background 0.2s, box-shadow 0.2s",
                  overflow: "visible"
                }}
                title="Voltar"
                onMouseOver={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px #2563eb55";
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px #2563eb33";
                }}
              >
                {/* SVG seta branca */}
                <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={dados}
                onClick={(e: any) => {
                  const index = e.activeTooltipIndex ?? 0;
                  const item = dados[index];
                  if (item) handleBarClick(item);
                }}
                barCategoryGap={nivel === "dia" ? 2 : nivel === "mes" ? 10 : 30}
              >
                <XAxis
                  dataKey={getLabelX()}
                  axisLine={false}
                  tickLine={false}
                  style={{ fontWeight: 500, fontSize: 13, fill: '#222' }}
                />
                <YAxis
                  dataKey="total_venda"
                  domain={[0, yMax]}
                  hide
                />
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

          {/* Gráfico 2 (placeholder) */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: 24,
            minHeight: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: 20
          }}>
            Gráfico 2 (em breve)
          </div>

          {/* Gráfico 3 (placeholder) */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: 24,
            minHeight: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: 20
          }}>
            Gráfico 3 (em breve)
          </div>

          {/* Gráfico 4 (placeholder) */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: 24,
            minHeight: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: 20
          }}>
            Gráfico 4 (em breve)
          </div>
        </div>
      </div>
    </div>
  );
}