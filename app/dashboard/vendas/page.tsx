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
import { useEffect, useState, MouseEvent } from "react";
import { Select } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const id_organizacao = 1111;

export default function VendasPage() {
  const [nivel, setNivel] = useState<"ano" | "mes" | "dia">("ano");
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  const [dados, setDados] = useState<any[]>([]);
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    buscarDados();
  }, [nivel, anoSelecionado, mesSelecionado, tipo, empresa]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">{getTitulo()}</h1>

      <div className="flex gap-4 mb-6">
        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select id="tipo" value={tipo} onChange={(e: any) => setTipo(e.target.value)}>
            <option value="">Todos</option>
            <option value="Venda">Venda</option>
            <option value="Servico">Serviço</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Select id="empresa" value={empresa} onChange={(e: any) => setEmpresa(e.target.value)}>
            <option value="">Todas</option>
            <option value="Matriz">Matriz</option>
            <option value="Filial">Filial</option>
          </Select>
        </div>
        {nivel !== "ano" && (
          <button
            className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
            onClick={voltarNivel}
          >
            Voltar
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dados}
          onClick={(e: any) => {
            const index = e?.activeTooltipIndex;
            if (index !== undefined && dados[index]) {
              handleBarClick(dados[index]);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={getLabelX()} />
          <YAxis />
          <Tooltip
            formatter={(v: any) =>
              Number(v).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Legend />
          <Bar dataKey="total_venda" fill="#2563eb" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="total_venda"
              position="top"
              formatter={(v: any) =>
                Number(v).toLocaleString("pt-BR", {
                  notation: "compact",
                })
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}