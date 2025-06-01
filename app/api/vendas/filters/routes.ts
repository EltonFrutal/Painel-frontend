// Importações
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Rota GET para buscar os dados
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM data_emissao) AS ano,
        SUM(valor_venda) AS total
      FROM vendas
      GROUP BY ano
      ORDER BY ano
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro na API de Vendas:', error);
    return NextResponse.json({ error: 'Erro ao buscar os dados de vendas' }, { status: 500 });
  }
}

