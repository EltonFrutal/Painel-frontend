// app/api/vendas/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ano = searchParams.get('ano');
  const organizacao = searchParams.get('organizacao');
  const empresa = searchParams.get('empresa');

  try {
    let query = '';
    const params: string[] = [];

    if (ano) {
      // 📊 Modo mensal
      query = `
        SELECT 
          EXTRACT(MONTH FROM data_emissao) AS mes, 
          SUM(valor_venda) AS total
        FROM vendas
        WHERE EXTRACT(YEAR FROM data_emissao) = $1
      `;
      params.push(ano);

      if (organizacao) {
        query += ' AND organizacao_nome = $2';
        params.push(organizacao);

        if (empresa) {
          query += ' AND empresa = $3';
          params.push(empresa);
        }
      } else if (empresa) {
        query += ' AND empresa = $2';
        params.push(empresa);
      }

      query += ' GROUP BY mes ORDER BY mes';
    } else {
      // 📊 Modo anual
      query = `
        SELECT 
          EXTRACT(YEAR FROM data_emissao) AS ano, 
          SUM(valor_venda) AS total
        FROM vendas
        WHERE 1=1
      `;

      if (organizacao) {
        query += ' AND organizacao_nome = $1';
        params.push(organizacao);

        if (empresa) {
          query += ' AND empresa = $2';
          params.push(empresa);
        }
      } else if (empresa) {
        query += ' AND empresa = $1';
        params.push(empresa);
      }

      query += ' GROUP BY ano ORDER BY ano';
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro na consulta:', error);
    return NextResponse.json({ erro: 'Erro na consulta' }, { status: 500 });
  }
}
