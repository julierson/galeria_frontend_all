import { Component, ViewChild } from '@angular/core';

// Importe para campo Imput com consulta
import { Subject, Observable, merge, Subscription } from 'rxjs';
import {debounceTime, map, distinctUntilChanged, filter} from 'rxjs/operators';
import {  NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// Importe para campo Imput com consulta

import { UsuarioEmpresaService } from '../services/gerencia/usuarioempresa/usuarioempresa.service';
import { CamposObr } from '../listaempresa/camposObr';
import { Router } from '@angular/router';
import { Empresa } from '../services/gerencia/empresa/empresa';
import { AutenticacaoService } from '../components/Seguranca/autenticacao.service';


@Component({
  selector: 'app-listaempresa',
  templateUrl: 'listaempresa.component.html',
  styleUrls: ['./listaempresa.component.scss'],
})

export class ListaEmpresaComponent {

  // variaveis model
  varEmpresa: Empresa;

  // > Validação dos campos obrigatórios
  isCamposObr: boolean = false;
  campoobrigatorio = CamposObr;
  classVarEmpresa = {};

  // Inputs com Pesquisa -------------------------[
  @ViewChild('instance', { static: false}) instance: NgbTypeahead;
  click$ = new Subject<string>();
  focusEmpresa$ = new Subject<string>();
  listaEmpresa: Empresa[] = new Array();
    
  constructor( 
    public router: Router,
    private usuarioEmpresaService: UsuarioEmpresaService,
    public autenticacaoService: AutenticacaoService,
  ) { 
  }

  ngOnInit(): void {
    this.getListaUsuarioEmpresa();
    this.classVarEmpresa = { 'form-control is-invalid': true};
    this.campoobrigatorio.find(item => item.campo === 'varEmpresa').erro = false;
  }

  // Inputs com Pesquisa ----------------------------------------------------------------
  pesquisaEmpresa = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusEmpresa$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
    map(term => (term === '' ? this.listaEmpresa
    : this.listaEmpresa.filter(v => v.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .indexOf(term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) > -1)).slice(0, 10))
    );
  }
  pesquisaEmpresaRes = (x: {nome: string}) => x.nome;

  getListaUsuarioEmpresa() {
    const usuarioId = this.autenticacaoService.getIdUsuario();

    this.usuarioEmpresaService.listaUsuarioEmpresaAll(usuarioId).subscribe(res => {
      this.listaEmpresa = []; 
        for( const dado of res){
            this.listaEmpresa.push(dado.usuarioEmpresaId.empresa);
        }
    });
  }

   // Validação ao sair do campo
   isValidaCampo(campo: String) {
    this.isCamposObr = false;
    if (campo === 'varEmpresa' || campo === '') {
      campo = 'varEmpresa';
      if (this.varEmpresa === undefined) {
        this.campoobrigatorio.find(item => item.campo === campo).erro = true;
        this.classVarEmpresa = { 'form-control is-invalid': true};
      } else {

        if (this.varEmpresa.id === undefined) {
          this.campoobrigatorio.find(item => item.campo === campo).erro = true;
          this.campoobrigatorio.find(item => item.campo === campo).mensagem = '<strong>Empresa</strong> inválido! Selecione um item da lista.';
          this.classVarEmpresa = { 'form-control is-invalid': true};
        } else {
          this.campoobrigatorio.find(item => item.campo === campo).erro = false;
          this.classVarEmpresa = { 'form-control': true};
       }
      }
      campo = '';
    }
  }

  // Validação ao execultar o click
  validaCampo() {
    this.isValidaCampo('');
    if (this.varEmpresa == null 
      || this.varEmpresa === undefined 
      || this.varEmpresa.id === undefined) {
      return true;
    }
  }

  voltar() {
    this.autenticacaoService.logout();
  }

  acessar() {
    if (this.validaCampo() === true) {
      this.isCamposObr = true;
      return;
    }

    this.autenticacaoService.setIdEmpresa(this.varEmpresa.id);
    this.autenticacaoService.setEmpresaNome(this.varEmpresa.nome);
    this.autenticacaoService.setUtilizaCodigoCliente(this.varEmpresa.utilizaCodigoCliente);
    this.router.navigate(['/home']);
  }

}
