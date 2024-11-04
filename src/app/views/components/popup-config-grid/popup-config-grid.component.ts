import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { IOption } from 'ng-select';
import { ModalDirective } from 'ngx-bootstrap/modal';

export interface ConfigGrid {
  tela: string,
  regPorPagina: number;
  selectedColuna: string
}

@Component({
  selector: 'app-popup-config-grid',
  templateUrl: 'popup-config-grid.component.html',
  styleUrls: ['./popup-config-grid.component.css'],
})

export class PopUpConfigGridComponent implements OnInit {

  @ViewChild('modalPopUp') public modalPopUp: ModalDirective;
  @Output() retorno = new EventEmitter();

  tituloModal: string;
  habilitaBtn: boolean = true;

  varTela: string;
  varNumRegistroPorPagina: number = 20;
  public varConfigGrid: Array<ConfigGrid> = []; 
  public varColunas: Array<IOption> = [];
  public varSelectedColunas: Array<string> = [];

  grid: any;
  constructor() {}

  ngOnInit(): void {
  }

  // Pop-Up Google Map
  show(tela: any, grid: any) {
    
    this.grid    = grid;
    this.varTela = tela;

    if(tela === 'CLIENTEATIVO'){
      this.varColunas = [
        {"label":"Código","value":"CODIGO"},
        {"label":"Nome","value":"NOME"},
        {"label":"Referência","value":"REFERENCIA"},
        {"label":"Indicacao","value":"INDICACAO"},
        {"label":"Celular","value":"CELULAR"},
        {"label":"Telefone","value":"TELEFONE"}];
    }

    if(tela === 'CLIENTELISTANEGRA'){
      this.varColunas = [
      {"label":"Código","value":"CODIGO"},
      {"label":"Nome","value":"NOME"},
      {"label":"Referência","value":"REFERENCIA"},
      {"label":"Indicacao","value":"INDICACAO"},
      {"label":"Motivo","value":"MOTIVO"},
      {"label":"Celular","value":"CELULAR"},
      {"label":"Telefone","value":"TELEFONE"}];
    }

    if(tela === 'CONTRATO'){
      this.varColunas = [
      {"label":"Código","value":"CODIGO"},
      {"label":"Contrato","value":"CONTRATO"},
      {"label":"Data","value":"DATA"},
      {"label":"Valor","value":"VALOR"},
      {"label":"Juros","value":"JUROS"},
      {"label":"Valor Total","value":"VALORTOTAL"}];
    }

    if(tela === 'COBRANCA'){
      this.varColunas = [
        {"label":"Código","value":"CODIGO"},
        {"label":"Data","value":"DATA"},
        {"label":"Descrição","value":"DESCRICAO"},
        {"label":"Situação","value":"SITUACAO"},
      ];
    }

    if(tela === 'COBRADOR'){
      this.varColunas = [
        {"label":"Código","value":"CODIGO"},
        {"label":"Funcionário","value":"FUNCIONARIO"},
      ];
    }

    if(tela === 'CAIXA'){
      this.varColunas = [
        {"label":"Código","value":"CODIGO"},
        {"label":"Descrição","value":"DESCRICAO"},
      ];
    }

    if(tela === 'CAIXAMOVIMENTACAO'){
      this.varColunas = [
        {"label":"Código","value":"CODIGO"},
        {"label":"Data","value":"DATA"},
        {"label":"Descrição","value":"DESCRICAO"},
        {"label":"Hora Abertura","value":"HORAABERTURA"},
        {"label":"Valor Abertura","value":"VALORABERTURA"},
        {"label":"Hora Fechamento","value":"HORAFECHAMENTO"},
        {"label":"Valor Fechamento","value":"VALORFECHAMENTO"},
      ];
    }
    
    this.getHistorico();
    
    this.tituloModal = 'Configuração';
    this.modalPopUp.show();
  }

  fechar() {
    this.modalPopUp.hide();
  }

  getHistorico(){
    this.varConfigGrid = JSON.parse(localStorage.getItem('ConfigGrid'));
    if(localStorage.getItem('ConfigGrid') !== null) {
      for (const item of this.varConfigGrid ) {
        if(item.tela === this.varTela) {
          this.varNumRegistroPorPagina = item.regPorPagina;
          this.varSelectedColunas = JSON.parse(item.selectedColuna);
        }
      }
    }
  }

  salvar(){

    if(localStorage.getItem('ConfigGrid') !== null) {

      const is = this;

      is.varConfigGrid = JSON.parse(localStorage.getItem('ConfigGrid'));
      const isExisteRegistro = is.varConfigGrid.some(function (item) {if (item.tela === is.varTela) return true});
     
      if(isExisteRegistro) {

       //Altera registro
        is.varConfigGrid.forEach(item => {
          if(item.tela === is.varTela) {
            item.tela = is.varTela;
            item.regPorPagina = is.varNumRegistroPorPagina;
            item.selectedColuna = JSON.stringify(is.varSelectedColunas);

            localStorage.setItem('ConfigGrid',JSON.stringify(is.varConfigGrid));
            
            is.retorno.emit(is.isColuna(is.varTela, is.varConfigGrid));
            is.fechar();
          }
        });

      }else{

        //Novo registro
        is.varConfigGrid.push({tela: is.varTela, regPorPagina: is.varNumRegistroPorPagina, selectedColuna: JSON.stringify(is.varSelectedColunas)});
        localStorage.setItem('ConfigGrid',JSON.stringify(is.varConfigGrid));
        
        is.retorno.emit(is.isColuna(is.varTela, is.varConfigGrid));
        is.fechar();
      }
    }
  }

  //Verifica as colunas habilitada pelo usuário
  isColuna(tela: any, configGrid: any): any {
      for (const item of configGrid) {

        if(item.tela === tela) {  

          this.grid.regPorPagina = item.regPorPagina
          if(item.selectedColuna !== undefined){

            this.varSelectedColunas         = JSON.parse(item.selectedColuna);

            this.grid.colunaCodigo          = this.varSelectedColunas.some(function (coluna) {if (coluna === 'CODIGO') return true});
            this.grid.colunaNome            = this.varSelectedColunas.some(function (coluna) {if (coluna === 'NOME') return true});
            this.grid.colunaReferencia      = this.varSelectedColunas.some(function (coluna) {if (coluna === 'REFERENCIA') return true});
            this.grid.colunaIndicacao       = this.varSelectedColunas.some(function (coluna) {if (coluna === 'INDICACAO') return true});
            this.grid.colunaMotivo          = this.varSelectedColunas.some(function (coluna) {if (coluna === 'MOTIVO') return true});
            this.grid.colunaTelefone        = this.varSelectedColunas.some(function (coluna) {if (coluna === 'TELEFONE') return true});
            this.grid.colunaCelular         = this.varSelectedColunas.some(function (coluna) {if (coluna === 'CELULAR') return true});
            this.grid.colunaContrato        = this.varSelectedColunas.some(function (coluna) {if (coluna === 'CONTRATO') return true}); 
            this.grid.colunaData            = this.varSelectedColunas.some(function (coluna) {if (coluna === 'DATA') return true}); 
            this.grid.colunaValor           = this.varSelectedColunas.some(function (coluna) {if (coluna === 'VALOR') return true}); 
            this.grid.colunaJuros           = this.varSelectedColunas.some(function (coluna) {if (coluna === 'JUROS') return true}); 
            this.grid.colunaValorTotal      = this.varSelectedColunas.some(function (coluna) {if (coluna === 'VALORTOTAL') return true}); 
            this.grid.colunaDescricao       = this.varSelectedColunas.some(function (coluna) {if (coluna === 'DESCRICAO') return true}); 
            this.grid.colunaSituacao        = this.varSelectedColunas.some(function (coluna) {if (coluna === 'SITUACAO') return true}); 
            this.grid.colunaFuncionario     = this.varSelectedColunas.some(function (coluna) {if (coluna === 'FUNCIONARIO') return true});    
            this.grid.colunaHoraAbertura    = this.varSelectedColunas.some(function (coluna) {if (coluna === 'HORAABERTURA') return true});  
            this.grid.colunaValorAbertura   = this.varSelectedColunas.some(function (coluna) {if (coluna === 'VALORABERTURA') return true});  
            this.grid.colunaHoraFechamento  = this.varSelectedColunas.some(function (coluna) {if (coluna === 'HORAFECHAMENTO') return true});  
            this.grid.colunaValorFechamento = this.varSelectedColunas.some(function (coluna) {if (coluna === 'VALORFECHAMENTO') return true}); 
          }  
        }    
      }
      return this.grid;
  }
}