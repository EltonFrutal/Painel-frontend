'use client';

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  LabelList
} from "recharts";
import { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import { Select } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { ArrowLeft, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

function adicionarVariacaoAbsoluta(dados: DadoAno[]) {
  return dados.map((item, idx, arr) => {
    if (idx === 0) return { ...item, variacao: null };
    const anterior = arr[idx - 1].total_venda || 0;
    const variacao = item.total_venda - anterior;
    return { ...item, variacao };
  });
}

export default function VendasPage() {
  const [nivel, setNivel] = useState<'ano' | 'mes' | 'dia'>('ano');
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  const [dados, setDados] = useState<Dado[]>([]);
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [organizacaoNome, setOrganizacaoNome] = useState("");
  const [escala, setEscala] = useState<"K" | "M" | "B" | "">("");
  const [anosExibidos, setAnosExibidos] = useState<5 | 10 | 0>(5); // 0 = todos
  const [showAnosDropdown, setShowAnosDropdown] = useState(false);
  const anosDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nome_usuario = localStorage.getItem("usuario") || "";
    const nome_organizacao = localStorage.getItem("organizacao") || "";
    setUsuario(nome_usuario);
    setOrganizacaoNome(nome_organizacao);
  }, []);

  useEffect(() => {
    const id_organizacao = Number(localStorage.getItem("id_organizacao"));
    if (!id_organizacao) return;

    const buscarDados = async () => {
      let url = `${API_URL}/vendas/${nivel}?id_organizacao=${id_organizacao}`;
      if (anoSelecionado) url += `&ano=${anoSelecionado}`;
      if (mesSelecionado) url += `&mes=${mesSelecionado}`;
      if (tipo) url += `&tipo=${tipo}`;
      if (empresa) url += `&empresa=${empresa}`;

      try {
        const response = await fetch(url);
        let json = await response.json();

        // Filtro dos anos exibidos apenas para o gráfico anual
        if (nivel === "ano" && anosExibidos !== 0) {
          json = json
            .sort((a: DadoAno, b: DadoAno) => b.ano - a.ano)
            .slice(0, anosExibidos)
            .sort((a: DadoAno, b: DadoAno) => a.ano - b.ano); // volta para ordem crescente
        }

        setDados(json);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };

    buscarDados();
  }, [nivel, anoSelecionado, mesSelecionado, tipo, empresa, anosExibidos]);

  useEffect(() => {
    if ((nivel === "ano" || nivel === "mes" || nivel === "dia") && dados.length > 0) {
      const max = Math.max(...dados.map(d => d.total_venda || 0));
      if (max >= 1e9) setEscala("B");
      else if (max >= 1e6) setEscala("M");
      else if (max >= 1e3) setEscala("K");
      else setEscala("");
    } else {
      setEscala("");
    }
  }, [nivel, dados]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        anosDropdownRef.current &&
        !anosDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAnosDropdown(false);
      }
    }
    if (showAnosDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAnosDropdown]);

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
    if (nivel === 'ano') return 'por Ano';
    if (nivel === 'mes') return `Mensal - Ano ${anoSelecionado}`;
    return `por Dia (${mesSelecionado}/${anoSelecionado})`;
  };

  const formatNumber = (n: number) => {
    if (nivel === "ano" || nivel === "mes" || nivel === "dia") {
      if (escala === "B") return (n / 1e9).toLocaleString("pt-BR", { minimumFractionDigits: n < 10e9 ? 2 : n < 100e9 ? 1 : 0, maximumFractionDigits: n < 10e9 ? 2 : n < 100e9 ? 1 : 0 });
      if (escala === "M") return (n / 1e6).toLocaleString("pt-BR", { minimumFractionDigits: n < 10e6 ? 2 : n < 100e6 ? 1 : 0, maximumFractionDigits: n < 10e6 ? 2 : n < 100e6 ? 1 : 0 });
      if (escala === "K") return (n / 1e3).toLocaleString("pt-BR", { minimumFractionDigits: n < 10e3 ? 2 : n < 100e3 ? 1 : 0, maximumFractionDigits: n < 10e3 ? 2 : n < 100e3 ? 1 : 0 });
      return n.toLocaleString("pt-BR");
    }
    return n.toLocaleString("pt-BR");
  };

  const maxValue = Math.max(...dados.map(d => d.total_venda || 0));
  const yMax = Math.ceil(maxValue * 1.1);
  const maxBarSize = nivel === 'mes' ? 80 : nivel === 'ano' ? 60 : 10;

  const dadosComVariacao = nivel === "ano" ? adicionarVariacaoAbsoluta(dados as DadoAno[]) : dados;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header usuario={usuario} organizacao={organizacaoNome} onMenuClick={() => setMenuAberto(true)} />
      <MenuLateral aberto={menuAberto} usuario={usuario} onClose={() => setMenuAberto(false)} />
      <div style={{ height: 56 }} />
      <div className="p-6">
        {/* Título fixo da página */}
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Vendas</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {/* Card do gráfico com título interno */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: "24px 24px 16px 24px",
            minHeight: 340,
            position: "relative",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Título dinâmico dentro do card, sempre visível no topo */}
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#2563eb",
              marginBottom: 8,
              textAlign: "left",
              zIndex: 2
            }}>
              {getTitulo()}
              {/* Legenda da escala */}
              {(escala && (nivel === "ano" || nivel === "mes" || nivel === "dia")) && (
                <div style={{ fontSize: 13, color: "#666", fontWeight: 400, marginTop: 2 }}>
                  {escala === "K" && "Valores em mil"}
                  {escala === "M" && "Valores em milhões"}
                  {escala === "B" && "Valores em bilhões"}
                </div>
              )}
            </div>
            {nivel === "ano" && (
              <div
                ref={anosDropdownRef}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer"
                  }}
                  onClick={() => setShowAnosDropdown((v) => !v)}
                  title="Selecionar período"
                >
                  <Calendar size={22} color="#2563eb" />
                </button>
                {showAnosDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: 32,
                      right: 0,
                      background: "#fff",
                      border: "1px solid #dbeafe",
                      borderRadius: 8,
                      boxShadow: "0 4px 16px #0001",
                      minWidth: 170,
                      padding: "4px 0"
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        color: anosExibidos === 5 ? "#2563eb" : "#222",
                        fontWeight: anosExibidos === 5 ? 600 : 400,
                        background: anosExibidos === 5 ? "#eff6ff" : "transparent"
                      }}
                      onClick={() => {
                        setAnosExibidos(5);
                        setShowAnosDropdown(false);
                      }}
                    >
                      Últimos 5 anos
                    </div>
                    <div
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        color: anosExibidos === 10 ? "#2563eb" : "#222",
                        fontWeight: anosExibidos === 10 ? 600 : 400,
                        background: anosExibidos === 10 ? "#eff6ff" : "transparent"
                      }}
                      onClick={() => {
                        setAnosExibidos(10);
                        setShowAnosDropdown(false);
                      }}
                    >
                      Últimos 10 anos
                    </div>
                    <div
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        color: anosExibidos === 0 ? "#2563eb" : "#222",
                        fontWeight: anosExibidos === 0 ? 600 : 400,
                        background: anosExibidos === 0 ? "#eff6ff" : "transparent"
                      }}
                      onClick={() => {
                        setAnosExibidos(0);
                        setShowAnosDropdown(false);
                      }}
                    >
                      Todos
                    </div>
                  </div>
                )}
              </div>
            )}
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={dadosComVariacao}
                margin={{
                  top: 16,
                  right: 0,
                  left: 0,
                  bottom: 8
                }}
                barCategoryGap={10}
                onClick={({ activeTooltipIndex }) => {
                  if (activeTooltipIndex != null) {
                    handleBarClick(dados[activeTooltipIndex]);
                  }
                }}
              >
                <XAxis
                  dataKey={nivel === "mes" ? "mes" : nivel === "dia" ? "dia" : "ano"}
                  axisLine={false}
                  tickLine={false}
                  style={{
                    fontWeight: 500,
                    fontSize: nivel === "dia" ? 12 : 13, // diminui um ponto no diário
                    fill: '#222'
                  }}
                  tickFormatter={
                    nivel === "mes"
                      ? (mes) => {
                          const meses = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                          return meses[mes] || mes;
                        }
                      : nivel === "dia"
                      ? (dia) => dia
                      : undefined
                  }
                />
                <YAxis dataKey="total_venda" domain={[0, yMax]} hide />
                <Bar
                  dataKey="total_venda"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  maxBarSize={60}
                  yAxisId={0}
                >
                  {/* Valor da barra */}
                  <LabelList
                    dataKey="total_venda"
                    position="top"
                    formatter={formatNumber}
                    style={{
                      fill: '#222',
                      fontWeight: 300, // mais fino
                      fontSize: nivel === "dia" ? 11 : nivel === "mes" ? 11 : 13, // anual agora 13 (antes era 14)
                      fontFamily: 'Bahnschrift, Inter, Roboto Mono, Menlo, monospace',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                    offset={16}
                  />
                  {/* Variação percentual em relação ao ano anterior */}
                  <LabelList
                    dataKey="variacao"
                    position="top"
                    content={(props) => {
                      const { x, y, value, index, width } = props as {
                        x?: number | string;
                        y?: number | string;
                        value?: string | number;
                        index?: number;
                        width?: number;
                      };
                      if (typeof index !== "number" || index === 0 || typeof value !== "number") return null;
                      // Pegue o valor do ano anterior do array de dadosComVariacao
                      const dados = dadosComVariacao as { total_venda: number }[];
                      const anterior = dados[index - 1]?.total_venda ?? 0;
                      if (!anterior) return null;
                      const percentual = Math.round((value / anterior) * 100);
                      const positivo = percentual > 0;

                      // Centraliza exatamente com a barra (x + width/2)
                      return (
                        <text
                          x={typeof x === "number" && typeof width === "number" ? x + width / 2 : x}
                          y={typeof y === "number" ? y - 4 : y}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={600}
                          fontFamily="Bahnschrift, Inter, Roboto Mono, Menlo, monospace"
                          fill={positivo ? "#22c55e" : "#ef4444"}
                        >
                          {positivo ? "▲" : "▼"} {Math.abs(percentual)}%
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {nivel !== "ano" && (
              <button
                className="ml-auto"
                onClick={voltarNivel}
                title="Voltar"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 3,
                  background: "none",
                  border: "none",
                  padding: 4,
                  cursor: "pointer"
                }}
              >
                <ArrowLeft size={22} color="#888" />
              </button>
            )}
          </div>

          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px #0001",
              padding: 24,
              minHeight: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontWeight: 500,
              fontSize: 18
            }}>
              Em breve...
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}