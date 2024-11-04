import { Injectable } from '@angular/core';

export interface ConfigGrid {
    tela: string,
    regPorPagina: number;
    selectedColuna: string
}

@Injectable({
    providedIn: 'root'
})

export class ConfigGridService {

    configGrid: Array<ConfigGrid> = [];
    varSelectedColunas: Array<string> = [];
    grid: any;

    //Verifica as colunas habilitada pelo usuário
    isColuna(tela: any, grid: any): any {

        this.grid = grid;

        if(localStorage.getItem('ConfigGrid') !== null) {

            this.configGrid = JSON.parse(localStorage.getItem('ConfigGrid'));

            const isExisteRegistro = this.configGrid.some(function (item) {if (item.tela === tela) return true});
     
            if(isExisteRegistro) {

                for (const item of this.configGrid ) {

                    if(item.tela === tela) {  

                        this.grid.regPorPagina = item.regPorPagina;

                        if(item.selectedColuna !== undefined){

                            this.varSelectedColunas     = JSON.parse(item.selectedColuna);

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
            }else{
                this.colunaTela(tela);
            }
            
        }else{
            this.colunaTela(tela);   
        }

        return this.grid;
    }
    
    colunaTela(tela: any): any{
        this.varSelectedColunas = [];

        if(this.grid.colunaCodigo){
            this.varSelectedColunas.push('CODIGO');
        }

        if(this.grid.colunaNome){
            this.varSelectedColunas.push('NOME');
        }

        if(this.grid.colunaMotivo){
            this.varSelectedColunas.push('MOTIVO');
        }

        if(this.grid.colunaReferencia){
            this.varSelectedColunas.push('REFERENCIA');
        }

        if(this.grid.colunaIndicacao){
            this.varSelectedColunas.push('INDICACAO');
        }

        if(this.grid.colunaTelefone){
            this.varSelectedColunas.push('TELEFONE');
        }

        if(this.grid.colunaCelular){
            this.varSelectedColunas.push('CELULAR');
        }

        if(this.grid.colunaContrato){
            this.varSelectedColunas.push('CONTRATO');
        }

        if(this.grid.colunaData){
            this.varSelectedColunas.push('DATA');
        }

        if(this.grid.colunaValor){
            this.varSelectedColunas.push('VALOR');
        }

        if(this.grid.colunaJuros){
            this.varSelectedColunas.push('JUROS');
        }

        if(this.grid.colunaValorTotal){
            this.varSelectedColunas.push('VALORTOTAL');
        }

        if(this.grid.colunaDescricao){
            this.varSelectedColunas.push('DESCRICAO');
        }

        if(this.grid.colunaDescricao){
            this.varSelectedColunas.push('SITUACAO');
        }

        if(this.grid.colunaFuncionario){
            this.varSelectedColunas.push('FUNCIONARIO');
        }

        if(this.grid.colunaHoraAbertura){
            this.varSelectedColunas.push('HORAABERTURA');
        }

        if(this.grid.colunaValorAbertura){
            this.varSelectedColunas.push('VALORABERTURA');
        }

        if(this.grid.colunaHoraFechamento){
            this.varSelectedColunas.push('HORAFECHAMENTO');
        }

        if(this.grid.colunaValorFechamento){
            this.varSelectedColunas.push('VALORFECHAMENTO');
        }
        
        this.configGrid.push({tela: tela, regPorPagina: this.grid.regPorPagina, selectedColuna: JSON.stringify(this.varSelectedColunas)});
        localStorage.setItem('ConfigGrid',JSON.stringify(this.configGrid));
    }
}