
export class GraficoDTO {
    quantidadeclientes: number;
    quantidadefuncionarios: number;
    quantidadeclientesativos: number;
	quantidadeclientesinativos: number;
	quantidadeclientesinadimplentes: number;
	quantidadeclientesarquivados: number;

    graficoEmprestimoAtualDetalhado: GraficoEmprestimoAtualDetalhadoDTO[];
    graficoEmprestimoMesDetalhado: GraficoEmprestimoMesDetalhadoDTO[];

    graficoVendas: GraficoVendasDTO[];
    graficoDespesa: GraficoDespesaDTO[];
}
export class GraficoEmprestimoAtualDetalhadoDTO {
    idempresa: number;
    valorcapital: number;
    valorjuros: number;
    valorjurosatrasado: number;
    valoratrasado: number;
    recebidonomes: number;
    valorinvestido: number;
}
export class GraficoEmprestimoMesDetalhadoDTO {
    mes: number;
    valorcapital: number;
    valorjuros: number;
    valoratrasado: number;
    valorcapitalinvestido: number;
}

export class GraficoVendasDTO {
    mes: number;
    valorvenda: number;
    valorrecebido: number;
    valoratrasado: number;
}
export class GraficoDespesaDTO {
    mes: number;
    valordespesa: number;
}
