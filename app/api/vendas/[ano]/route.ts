import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { ano: string } }) {
  const ano = params.ano;

  try {
    const { searchParams } = new URL(request.url);
    const organizacao = searchParams.get('organizacao') || '';
    const empresa = searchParams.get('empresa') || '';

    // 🟡 ADICIONE O CONSOLE.LOG AQUI:
    console.log('Ano:', ano);
    console.log('Organizacao:', organizacao);
    console.log('Empresa:', empresa);

    // Sua query continua aqui...
    const result = await pool.query(
      `SELECT 
         EXTRACT(MONTH FROM data_emissao) AS mes, 
         SUM(valor_venda) AS total
       FROM vendas
       WHERE EXTRACT(YEAR FROM data_emissao) = $1
         AND ($2 = '' OR organizacao_nome = $2)
         AND ($3 = '' OR empresa = $3)
       GROUP BY mes
       ORDER BY mes`,
      [ano, organizacao, empresa]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ erro: 'Erro na consulta' }, { status: 500 });
  }
}
