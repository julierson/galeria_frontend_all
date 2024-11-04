import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { Router } from '@angular/router';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { DatePipe } from '@angular/common';

import { GraficoDTO, GraficoVendasDTO, GraficoDespesaDTO, GraficoEmprestimoAtualDetalhadoDTO, GraficoEmprestimoMesDetalhadoDTO } from '../../services/grafico/graficodto';

import { GraficoService } from '../../services/grafico/grafico.service';
import { AutorizacaoService } from '../../components/Seguranca/autorizacao.service';
import { AutenticacaoService } from '../../components/Seguranca/autenticacao.service';
import { PermissaoService } from '../../services/gerencia/configuracao/permissao/permissao.service';
import { getTime } from 'date-fns';
import { Subscription, timer } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Administracao } from '../../services/tabelasbasica/logsistema/administracao.service';
import { PopPupAlertaComponent } from '../../components/popup-alerta/popup-alerta.component';
import { SessionService } from '../../components/Seguranca/session.service';

export interface DadoGrafico {
    idSicronismo: any;
    dataHoraSicronismo: any;
}
@Component({
    selector: 'app-grafico',
    templateUrl: './grafico.component.html',
    styleUrls: ['./grafico.component.scss'],
})

export class GraficoComponent implements OnInit {
    
    dadoGrafico: DadoGrafico = { idSicronismo: 0, dataHoraSicronismo: null };
    
    // Contrato do Gráfico ------------------------------------------------------
    varTituloDropdownToggle: String = '';
    varTipoGrafico: number = 0;
    varOpcao: string = 'Day';
    varOpcaoGrafico: number = 1;

    isExibeDetalhesEmprestimo: number = 0;

    // Variávei para os dados----------------------------------------------------
    varNumCliente: number = 0;
    varNumFuncionario: number = 0;
    varNumClientesativos: number = 0;
    varNumClientesinativos: number = 0;
    varNumClientesinadimplentes: number = 0;
    varNumClientesarquivados: number = 0;

    // Empréstimo
    varValorCapital: number = 0;
    varValorJuros: number = 0;
    varValorJurosAtrasado: number = 0;
    varValorTotal: number = 0;
    varValorAtrasado: number = 0;
    varValorRecebidonomes: number = 0;
    varValorCapitalInvestido: number = 0;
    varValorInvestido: number = 0;

    varValorCapitalTotal: number = 0;
    varValorJurosTotal: number = 0;
    varValorTotalGeral: number = 0;
    varValorAtrasadoTotal: number = 0;
    varValorTotalEmpresatimo: number = 0;

    // Venda
    varValorVenda: number = 0;
    varValorRecebido: number = 0;
    varValorTotalVendas: number = 0;
    varValorVendaAtrasado: number = 0;

    // Despesa
    varValorDespesa: number = 0;

    // Propriedade do Gráfico----------------------------------------------------
    graficoDto: GraficoDTO;
    graficoEmprestimoAtualDetalhadoDTO: GraficoEmprestimoAtualDetalhadoDTO[]  = new Array();
    graficoEmprestimoMesDetalhadoDTO: GraficoEmprestimoMesDetalhadoDTO []     = new Array();

    graficoVendasDTO: GraficoVendasDTO []                   = new Array();
    graficoDespesaDTO: GraficoDespesaDTO []                 = new Array();

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0}}]
          }
    };

    public barChartType: string;
    public barChartLegend: boolean          = true;
    public barChartLabels: string[]         = [];
    public barChartData: any[];


    // lineChart
    public lineChartEmpData: Array<any>     = [];
    public lineChartEmpLabels: Array<any>   = [];
    public lineChartEmpOptions: any;
    public lineChartEmpColours: Array<any>  = [];
    public lineChartEmpLegend = false;
    public lineChartEmpType = 'line';

    public lineChartVendData: Array<any>    = [];
    public lineChartVendLabels: Array<any>  = [];
    public lineChartVendOptions: any;
    public lineChartVendColours: Array<any> = [];
    public lineChartVendLegend = false;
    public lineChartVendType = 'line';

    // Ações da tela
    isAcaoAcessoVenda: boolean               = false;
    isAcaoAcessoDespesa: boolean             = false;
    isAcaoAcessoEmprestimoDetalhado: boolean = false;

    tipoEmprestimoCliente: String;
    empresaId: number;

     // PopUp - Alerta
    @ViewChild(PopPupAlertaComponent, {static: false}) appPopupAlerta: PopPupAlertaComponent;

    @BlockUI() blockUI: NgBlockUI;
    constructor(
        public router: Router,
        private graficoService: GraficoService,
        public autenticacaoService: AutenticacaoService,
        private autorizacao: AutorizacaoService,
        private autenticacao: AutenticacaoService,
        private permissaoService: PermissaoService,
        private administracao: Administracao,
        private sessionService: SessionService,
    ) 
    {

         // Controle de session
         if( JSON.parse(this.sessionService.getDadoGrafico()) != null){
            this.dadoGrafico = JSON.parse(this.sessionService.getDadoGrafico());
        }
        
        this.empresaId = this.autenticacao.getIdEmpresa();
        this.isAcaoAcessoEmprestimoDetalhado = this.autorizacao.possuiPermissao('CLIENTEEMPRESTIMODETALHADO');
        this.isAcaoAcessoVenda               = this.autorizacao.possuiPermissao('CLIENTEVENDA');

        if ( this.autorizacao.possuiPermissao('DESPESACADASTRAR') ||
            this.autorizacao.possuiPermissao('DESPESAVISUALIZAR') ||
            this.autorizacao.possuiPermissao('DESPESAEDITAR') ||
            this.autorizacao.possuiPermissao('DESPESAEXCLUIR')
        ){
        this.isAcaoAcessoDespesa = true;
        }
    }

    ngOnInit() {

        this.isExibeDetalhesEmprestimo = +localStorage.getItem('exibeDetalheGrafico');
        if (this.isExibeDetalhesEmprestimo === 0) {
            this.isExibeDetalhesEmprestimo = 2;
            localStorage.setItem('exibeDetalheGrafico', JSON.stringify(2));
        }

        this.permissaoService.consultar('').subscribe(res => {

            if (res.length > 0) {
                this.tipoEmprestimoCliente = res.find(item => item.nome === 'CLIENTEEMPRESTIMODETALHADO').nome;
            }
        });
       
        /* Busca dados*/
        this.barChartType = 'bar';
        this.setDadosGraficoEmprestimo('1');
        this.setLineChartEmprestimo();
        this.setLineChartVenda(); 
        this.atualizaDadosGrafico();
    }

    sincronizarDados() {
        if( this.dadoGrafico.idSicronismo > 0){
            this.appPopupAlerta.showAlerta('ALERTA-GLAFICO', 'Atenção', 'Existe uma sincronização realizada em ' 
            + this.dadoGrafico.dataHoraSicronismo + '! Aguarde a finalização para solicitar novamente.');
        }else{
            this.exesincronizarDados(30000);
        }
    }

    retornoAlerta(res: any){
        if(res == 'SIM'){
            this.exesincronizarDados(5000);
        }else{
            this.atualizaDadosGrafico();
        }
    }

    async exesincronizarDados(tempo: any) {

        let idSicronismo = 0

        if( this.dadoGrafico.idSicronismo > 0){
            idSicronismo =  this.dadoGrafico.idSicronismo;

            // Comece a bloquear
            this.blockUI.start('Aguarde a sincronização dos dados..');

        } else{

            // Comece a bloquear
            this.blockUI.start('Aguarde a sincronização dos dados..');

            idSicronismo = await this.sincronizaDado('GRAFICO');

            if(idSicronismo === 0) {

                this.appPopupAlerta.showAlerta('ATENCAO', 'Falha', 'Houve uma falha na sincronização dos dados');
    
                // Pare de bloquear
                this.blockUI.stop();

                return
            }

            // Armazena o dado para controle
            this.dadoGrafico.idSicronismo = idSicronismo;
            
            const dadHoje = new Date();
            const data = new DatePipe('pt-BR').transform(new Date(), 'dd/MM/yyyy');
            const hora = new DatePipe('pt-BR').transform(new Date(), 'HH:mm:ss');

            this.dadoGrafico.dataHoraSicronismo = data + ' às ' + hora;
            this.sessionService.setDadoGrafico(JSON.stringify(this.dadoGrafico));
        }

        // A cada 30 segundos faça verificação
        await this.verificaSicronizacao(tempo, idSicronismo);
        
        this.appPopupAlerta.showAlerta('AVISO', 'Informação', 'Sincronização dos dados realizada com sucesso');  

        // Pare de bloquear
        this.blockUI.stop();

        // Processo finalizou sem interrupções do usuario
        this.dadoGrafico.idSicronismo = 0;
        this.dadoGrafico.dataHoraSicronismo = null;
        this.sessionService.setDadoGrafico(JSON.stringify(this.dadoGrafico));
    }

    sincronizaDado(servico: any): Promise<any> {
        return this.administracao.sincronizaDados(servico).toPromise();
    }

    isVerificaSicronizacao(id: any): Promise<any> {
        return this.administracao.isVerificaSicronizacao(id).toPromise();
    }

    async verificaSicronizacao(tempo: any, id: any) {
        await new Promise( resolve => setTimeout(resolve, tempo));

        const next = await this.isVerificaSicronizacao(id);

        if(next==='false'){
            tempo = tempo == 5000 ? 30000 : tempo;
            await this.verificaSicronizacao(tempo, id);
        }

        return new Promise( resolve => setTimeout(resolve, 1));
    }

    atualizaDadosGrafico(){
        // Comece a bloquear
        this.blockUI.start('Aguarde o processamento do gráfico...');

        this.graficoService.getDadosGrafico().subscribe(res => {

            this.graficoDto                          = res;
            
            this.varNumCliente                       = this.graficoDto.quantidadeclientes;
            this.varNumFuncionario                   = this.graficoDto.quantidadefuncionarios;
            this.varNumClientesativos                = this.graficoDto.quantidadeclientesativos;
            this.varNumClientesinativos              = this.graficoDto.quantidadeclientesinativos;
            this.varNumClientesinadimplentes         = this.graficoDto.quantidadeclientesinadimplentes;
            this.varNumClientesarquivados            = this.graficoDto.quantidadeclientesarquivados;

            this.graficoEmprestimoAtualDetalhadoDTO  = this.graficoDto.graficoEmprestimoAtualDetalhado;
            this.graficoEmprestimoMesDetalhadoDTO    = this.graficoDto.graficoEmprestimoMesDetalhado;

            this.graficoVendasDTO                    = this.graficoDto.graficoVendas;
            this.graficoDespesaDTO                   = this.graficoDto.graficoDespesa;

            if (this.isAcaoAcessoEmprestimoDetalhado === true) {
                this.varTituloDropdownToggle = 'Empréstimos';
                this.varTipoGrafico = 1;
                this.setDadosGraficoEmprestimo('1');
            }

            if (this.tipoEmprestimoCliente === 'CLIENTEEMPRESTIMODETALHADO') {
                if ( this.isAcaoAcessoEmprestimoDetalhado === false && this.isAcaoAcessoVenda === true) {
                    this.varTituloDropdownToggle = 'Vendas';
                    this.varTipoGrafico = 2;
                    this.setDadosGraficoVenda();
                }

                if ( this.isAcaoAcessoEmprestimoDetalhado === false && this.isAcaoAcessoVenda === false
                    && this.isAcaoAcessoDespesa === true) {
                    this.varTituloDropdownToggle = 'Despesas';
                    this.varTipoGrafico = 3;
                    this.setDadosGraficoDespesa();
                }
            }

            // Pare de bloquear
            this.blockUI.stop();

            this.setLineChartEmprestimo();
            this.setLineChartVenda();
        });
       
    }
      
    setDadosGraficoEmprestimo(opcaoGrafico: String) {
        this.varOpcaoGrafico = +opcaoGrafico;

        const dadoMes                    = [];
        const dadosValorCapitalInvestido = [];
        const dadosValorCapital          = [];
        const dadosValorJuros            = [];
        const dadosValorJurosAtrasado    = [];
        const dadosValorTotal            = [];
        const dadosValorAtrasado         = [];
        const dadosRecebidonoMes         = [];
        const dadosInvestidonoMes        = [];
        const is                         = this;

        // Gráfico do dia
        if (this.varOpcaoGrafico === 1) {
            dadoMes.push('');
            this.barChartLabels = [this. getDataString()];

            let emprestimo = [];

            if (this.isAcaoAcessoEmprestimoDetalhado && this.tipoEmprestimoCliente === 'CLIENTEEMPRESTIMODETALHADO') {
                emprestimo = this.graficoEmprestimoAtualDetalhadoDTO;
            }

            emprestimo.forEach(function(dado) {

                // Valor Capital
                is.varValorCapital = 0
                if (dado.valorcapital > 0) {
                    is.varValorCapital = dado.valorcapital;
                    dadosValorCapital.push(dado.valorcapital);
                }

                // Valor Juros
                is.varValorJuros = 0;
                if (dado.valorjuros > 0) {
                    is.varValorJuros = dado.valorjuros;
                    dadosValorJuros.push(dado.valorjuros);
                }

                // Valor Juros Atrasado
                is.varValorJurosAtrasado = 0;
                if (dado.valorjurosatrasado > 0) {
                    is.varValorJurosAtrasado = dado.valorjurosatrasado;
                    dadosValorJurosAtrasado.push(dado.valorjurosatrasado);
                }

                // Valor Total
                is.varValorTotal = 0;
                if (dado.valorcapital > 0 || dado.valorjuros > 0) {
                    const valorTotal = dado.valorcapital + dado.valorjuros;
                    is.varValorTotal = valorTotal;
                    dadosValorTotal.push(valorTotal);
                }

                // Valor Atrasado
                is.varValorAtrasado = 0;
                if (dado.valoratrasado > 0) {
                    is.varValorAtrasado = dado.valoratrasado;
                    dadosValorAtrasado.push(dado.valoratrasado);
                }

                // Recebido no mês
                is.varValorRecebidonomes = 0;
                if (dado.recebidonomes > 0) {
                    is.varValorRecebidonomes = dado.recebidonomes;
                    dadosRecebidonoMes.push(dado.recebidonomes);
                }

                // Investido no mês
                is.varValorInvestido = 0;
                if (dado.valorinvestido > 0) {
                    is.varValorInvestido = dado.valorinvestido;
                    dadosInvestidonoMes.push(dado.valorinvestido);
                }
            });
        }

         // Gráfico do Mensal
        if (this.varOpcaoGrafico === 2) {

            is.varValorCapitalInvestido = 0;
            is.varValorCapitalTotal     = 0;
            is.varValorJurosTotal       = 0;
            is.varValorTotalGeral       = 0;
            is.varValorAtrasadoTotal    = 0;

            let emprestimo = [];

            if (this.isAcaoAcessoEmprestimoDetalhado) {
                emprestimo = this.graficoEmprestimoMesDetalhadoDTO;
            }

            emprestimo.forEach(function(dado) {

                // Mês
                dadoMes.push(is.getMes(dado.mes));

                // Valor Capital Investido
                is.varValorCapitalInvestido += dado.valorinvestido;
                dadosValorCapitalInvestido.push(dado.valorinvestido);

                // Valor Capital
                is.varValorCapitalTotal += dado.valorcapital;
                dadosValorCapital.push(dado.valorcapital);

                // Valor Juros
                is.varValorJurosTotal += dado.valorjuros;
                dadosValorJuros.push(dado.valorjuros);

                // Valor Juros Atrasado

                // Valor Total
                const valorTotal = dado.valorcapital + dado.valorjuros;
                is.varValorTotalGeral += valorTotal;
                dadosValorTotal.push(valorTotal);

                // Valor Atraso
                is.varValorAtrasadoTotal += dado.valoratrasado;
                dadosValorAtrasado.push(dado.valoratrasado);
            });
        }

        this.barChartLabels = dadoMes;

        // Gráfico do dia
        if (this.varOpcaoGrafico === 1) {

            this.barChartData = [
                {
                    data: dadosValorCapital, label: 'CAPITAL',
                    backgroundColor: '#61bbe6' , hoverBackgroundColor: '#61bbe6', borderColor: '#61bbe6', hoverBorderColor: '#61bbe6',
                    pointHoverBorderColor: '#61bbe6', pointHoverBackgroundColor: '#61bbe6', pointBorderColor: '#61bbe6',
                    pointHouverBorderColor: '#61bbe6',
                },
                {
                    data: dadosValorJuros, label: 'JUROS',
                    backgroundColor: '#ffff00' , hoverBackgroundColor: '#ffff00', borderColor: '#ffff00', hoverBorderColor: '#ffff00',
                    pointHoverBorderColor: '#ffff00', pointHoverBackgroundColor: '#ffff00', pointBorderColor: '#ffff00',
                    pointHouverBorderColor: '#ffff00',
                },
                {
                    data: dadosValorJurosAtrasado, label: 'JUROS POR ATRASO',
                    backgroundColor: '#ffa500' , hoverBackgroundColor: '#ffa500', borderColor: '#ffa500', hoverBorderColor: '#ffa500',
                    pointHoverBorderColor: '#ffa500', pointHoverBackgroundColor: '#ffa500', pointBorderColor: '#ffa500',
                    pointHouverBorderColor: '#ffa500',
                },
                {
                    data: dadosValorTotal, label: 'TOTAL',
                    backgroundColor: '#22c049' , hoverBackgroundColor: '#22c049', borderColor: '#22c049', hoverBorderColor: '#22c049',
                    pointHoverBorderColor: '#22c049', pointHoverBackgroundColor: '#22c049', pointBorderColor: '#22c049',
                    pointHouverBorderColor: '#22c049',
                },
                {
                    data: dadosValorAtrasado, label: 'ATRASADO',
                    backgroundColor: '#ec6645' , hoverBackgroundColor: '#ec6645', borderColor: '#ec6645', hoverBorderColor: '#ec6645',
                    pointHoverBorderColor: '#ec6645', pointHoverBackgroundColor: '#ec6645', pointBorderColor: '#ec6645',
                    pointHouverBorderColor: '#ec6645',
                },
                {
                    data: dadosInvestidonoMes, label: 'CAPITAL INVESTIDO',
                    backgroundColor: '#ffa500' , hoverBackgroundColor: '#ffa500', borderColor: '#ffa500', hoverBorderColor: '#ffa500',
                    pointHoverBorderColor: '#ffa500', pointHoverBackgroundColor: '#ffa500', pointBorderColor: '#ffa500',
                    pointHouverBorderColor: '#ffa500',
                },
                {
                    data: dadosRecebidonoMes, label: 'RECEBIDO NO MÊS',
                    backgroundColor: '#7cfc00' , hoverBackgroundColor: '#7cfc00', borderColor: '#7cfc00', hoverBorderColor: '#7cfc00',
                    pointHoverBorderColor: '#7cfc00', pointHoverBackgroundColor: '#7cfc00', pointBorderColor: '#7cfc00',
                    pointHouverBorderColor: '#7cfc00',
                }
            ];
        } else {

            // Gráfico do Mês
            this.barChartData = [
                {
                    data: dadosValorCapitalInvestido, label: 'CAPITAL INVESTIDO',
                    backgroundColor: '#ffa500' , hoverBackgroundColor: '#ffa500', borderColor: '#ffa500', hoverBorderColor: '#ffa500',
                    pointHoverBorderColor: '#ffa500', pointHoverBackgroundColor: '#ffa500', pointBorderColor: '#ffa500',
                    pointHouverBorderColor: '#ffa500',
                },
                {
                    data: dadosValorCapital, label: 'CAPITAL',
                    backgroundColor: '#61bbe6' , hoverBackgroundColor: '#61bbe6', borderColor: '#61bbe6', hoverBorderColor: '#61bbe6',
                    pointHoverBorderColor: '#61bbe6', pointHoverBackgroundColor: '#61bbe6', pointBorderColor: '#61bbe6',
                    pointHouverBorderColor: '#61bbe6',
                },
                {
                    data: dadosValorJuros, label: 'JUROS',
                    backgroundColor: '#ffff00' , hoverBackgroundColor: '#ffff00', borderColor: '#ffff00', hoverBorderColor: '#ffff00',
                    pointHoverBorderColor: '#ffff00', pointHoverBackgroundColor: '#ffff00', pointBorderColor: '#ffff00',
                    pointHouverBorderColor: '#ffff00',
                },
                {
                    data: dadosValorTotal, label: 'TOTAL',
                    backgroundColor: '#22c049' , hoverBackgroundColor: '#22c049', borderColor: '#22c049', hoverBorderColor: '#22c049',
                    pointHoverBorderColor: '#22c049', pointHoverBackgroundColor: '#22c049', pointBorderColor: '#22c049',
                    pointHouverBorderColor: '#22c049',
                },
                {
                    data: dadosValorAtrasado, label: 'ATRASADO',
                    backgroundColor: '#ec6645' , hoverBackgroundColor: '#ec6645', borderColor: '#ec6645', hoverBorderColor: '#ec6645',
                    pointHoverBorderColor: '#ec6645', pointHoverBackgroundColor: '#ec6645', pointBorderColor: '#ec6645',
                    pointHouverBorderColor: '#ec6645',
                }
            ];
        }
    }

    setDadosGraficoVenda() {

        const dadoMes               = [];
        const dadosValorVenda       = [];
        const dadosValorRecebido    = [];
        const dadosValorAtrasado    = [];
        const is                    = this;

        is.varValorVenda    = 0;
        is.varValorRecebido = 0;
        is.varValorVendaAtrasado = 0;
        this.graficoVendasDTO.forEach(function(dado) {

            // Mês
            dadoMes.push(is.getMes(dado.mes));

            // Valor Venda
            is.varValorVenda += dado.valorvenda;
            dadosValorVenda.push(dado.valorvenda);

            // Valor Recebido
            is.varValorRecebido += dado.valorrecebido;
            dadosValorRecebido.push(dado.valorrecebido);

            // Valor Recebido
            is.varValorVendaAtrasado += dado.valoratrasado;
            dadosValorAtrasado.push(dado.valoratrasado);

        });

        this.barChartLabels = dadoMes;
        this.barChartData = [
            { data: dadosValorVenda, label: 'VENDAS',
            backgroundColor: '#22c049' , hoverBackgroundColor: '#22c049', borderColor: '#22c049', hoverBorderColor: '#22c049',
            pointHoverBorderColor: '#22c049', pointHoverBackgroundColor: '#22c049', pointBorderColor: '#22c049',  pointHouverBorderColor: '#22c049'},
            { data: dadosValorRecebido, label: 'RECEBIDO' },
            {
                data: dadosValorAtrasado, label: 'ATRASADO',
                backgroundColor: '#ec6645' , hoverBackgroundColor: '#ec6645', borderColor: '#ec6645', hoverBorderColor: '#ec6645',
                pointHoverBorderColor: '#ec6645', pointHoverBackgroundColor: '#ec6645', pointBorderColor: '#ec6645',
                pointHouverBorderColor: '#ec6645',
            }
        ];
    }

    setDadosGraficoDespesa() {

        const dadoMes           = [];
        const dadosValorDespesa = [];
        const is                = this;

        is.varValorDespesa  = 0;
        this.graficoDespesaDTO.forEach(function(dado) {

            // Mês
            dadoMes.push(is.getMes(dado.mes));

            // Valor Despesa
            is.varValorDespesa += dado.valordespesa;
            dadosValorDespesa.push(dado.valordespesa);

        });

        this.barChartLabels = dadoMes;
        this.barChartData = [
            {
                data: dadosValorDespesa, label: 'DESPESAS',
                backgroundColor: '#ec6645' , hoverBackgroundColor: '#ec6645', borderColor: '#ec6645', hoverBorderColor: '#ec6645',
                pointHoverBorderColor: '#ec6645', pointHoverBackgroundColor: '#ec6645', pointBorderColor: '#ec6645',
                pointHouverBorderColor: '#ec6645',
            }
        ];
    }

    setLineChartEmprestimo() {

        const dadoMes = [];
        const dados    = [];
        const is      = this;

        is.varValorTotalEmpresatimo = 0;

        let emprestimo = [];

        if (this.isAcaoAcessoEmprestimoDetalhado) {
            emprestimo = this.graficoEmprestimoMesDetalhadoDTO;
        }

        emprestimo.forEach(function(dado) {
            if (dado.valorcapital  > 0) {
                // Mês
                dadoMes.push(is.getMes(dado.mes));

                // Valor total mensal
                dados.push(dado.valorcapital);

                // Valor total do empréstimo
                is.varValorTotalEmpresatimo += dado.valorcapital;
            }
        });

        this.lineChartEmpData    = [{data: dados, label: 'Series A'}];
        this.lineChartEmpLabels  = dadoMes;
        this.lineChartEmpOptions = {
            tooltips: {
            enabled: false,
            custom: CustomTooltips,
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                gridLines: { color: 'transparent', zeroLineColor: 'transparent' },
                ticks: {fontSize: 2, fontColor: 'transparent' }
                }],
                yAxes: [{display: false, ticks: {display: false, min: 0, max: 10000 + 5, } }],
            },
            elements: {
                line: { borderWidth: 1},
                point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
            },
            legend: {display: false }
        };

        this.lineChartEmpColours = [
        {
            backgroundColor: getStyle('--primary'),
            borderColor: 'rgba(255,255,255,.55)'
        }];
    }

    setLineChartVenda() {

        const dadoMes = [];
        const dados   = [];
        const is      = this;

        is.varValorTotalVendas = 0;
        this.graficoVendasDTO.forEach(function(dado) {

            if (dado.valorvenda  > 0) {
                // Mês
                dadoMes.push(is.getMes(dado.mes));

                // Valor total mensal
                dados.push(dado.valorvenda);

                // Valor total das vendas
                is.varValorTotalVendas += dado.valorvenda;
            }
        });

        this.lineChartVendData    = [{data: dados, label: 'Series A'}];
        this.lineChartVendLabels  = dadoMes;
        this.lineChartVendOptions = {
            tooltips: {
            enabled: false,
            custom: CustomTooltips,
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                gridLines: { color: 'transparent', zeroLineColor: 'transparent' },
                ticks: {fontSize: 2, fontColor: 'transparent' }
                }],
                yAxes: [{display: false, ticks: {display: false, min: 0, max: 10000 + 5, } }],
            },
            elements: {
                line: { borderWidth: 1},
                point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
            },
            legend: {display: false }
        };

        this.lineChartVendColours = [
        {
             backgroundColor: getStyle('--primary'),
             borderColor: 'rgba(255,255,255,.55)'
        }];
     }

    public randomize(): void {
        // Alterar apenas 3 valores
        /*
        const data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.random() * 100,
            56,
            Math.random() * 100,
            40
        ];
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        */

        /**
        * (Meu palpite), para Angular reconhecer a alteração no conjunto de dados
        * ele precisa alterar diretamente a variável do conjunto de dados,
        * Então, uma maneira de contornar isso é clonar os dados, alterá-los e depois
        * atribuí-lo;
        */
    }

    public chartHovered(e: any): void {
    }

    // events
    public chartClicked(e: any): void {
    }

    link(link: String) {
        if (link === 'CLIENTE') {
            this.router.navigate(['/contrato/cliente']);
        }

        if (link === 'FUNCIONARIO') {
            this.router.navigate(['/funcionario']);
        }
    }

    setaTituloDropdownToggle( titulo: String, tipoGrafico: String) {
        this.varTituloDropdownToggle = titulo;
        this.varTipoGrafico = +tipoGrafico;

        if (this.varTipoGrafico === 1) {
            this.setDadosGraficoEmprestimo('1');
            this.varOpcao = 'Day';
        }

        if (this.varTipoGrafico === 2) {
            this.setDadosGraficoVenda();
        }

        if (this.varTipoGrafico === 3) {
            this.setDadosGraficoDespesa();
        }
    }

    getDataString() {
        return new DatePipe('pt-BR').transform(new Date(), 'dd/MM/yyyy');
    }

    getMes(mes: number) {
        switch (mes) {
            case 1: {return 'Jan'; }
            case 2: {return 'Fev'; }
            case 3: {return 'Mar'; }
            case 4: {return 'Abr'; }
            case 5: {return 'Mai'; }
            case 6: {return 'Jun'; }
            case 7: {return 'Jul'; }
            case 8: {return 'Ago'; }
            case 9: {return 'Set'; }
            case 10: {return 'Out'; }
            case 11: {return 'Nov'; }
            case 12: {return 'Dez'; }
            default: {break; }
        }
    }

    exibeDetalheEmprestimo(acao: number) {
        localStorage.setItem('exibeDetalheGrafico', JSON.stringify(acao));
        this.isExibeDetalhesEmprestimo = acao;
    }
}
