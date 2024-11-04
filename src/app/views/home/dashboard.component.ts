import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutorizacaoService } from '../components/Seguranca/autorizacao.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  // Ações da tela
  isAcaoAcessoMenuIndicadores: boolean  =  false;
  isAcaoAcessoEmprestimo: boolean       =  false;
  isAcaoAcessoVenda: boolean            =  false;
  isAcaoAcessoDespesa: boolean          =  false;

  constructor( private autorizacao: AutorizacaoService) {

    this.isAcaoAcessoMenuIndicadores = this.autorizacao.possuiPermissao('INDICADORES');
    this.isAcaoAcessoEmprestimo      = this.autorizacao.possuiPermissao('CLIENTEEMPRESTIMO');
    this.isAcaoAcessoVenda           = this.autorizacao.possuiPermissao('CLIENTEVENDA');

    if (  this.autorizacao.possuiPermissao('DESPESACADASTRAR') ||
          this.autorizacao.possuiPermissao('DESPESAVISUALIZAR') ||
          this.autorizacao.possuiPermissao('DESPESAEDITAR') ||
          this.autorizacao.possuiPermissao('DESPESAEXCLUIR')

        ) {
        this.isAcaoAcessoDespesa = true;
    }
  }

}
