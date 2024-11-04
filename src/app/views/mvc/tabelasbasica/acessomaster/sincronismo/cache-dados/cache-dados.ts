import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ViewChild } from '@angular/core';

//--------------------------------------------
// Importe para campo Imput com consulta
import { Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
//--------------------------------------------

import { PopPupAlertaComponent } from '../../../../../components/popup-alerta/popup-alerta.component';
import { CacheService } from '../../../../../services/cache/cache.service';

// Importe para campo Imput com consulta
export interface SelectServico {
  name: string;
  select: boolean;
  color: ThemePalette;
  subtasks?: SubSelectServico[];
}

export interface SubSelectServico {
  id: number,
  name: string;
  select: boolean;
  color: ThemePalette;
}

@Component({
  selector: 'app-cache-dados',
  templateUrl: 'cache-dados.component.html',
  styleUrls: ['./cache-dados.component.css'],
})

export class CacheDadosComponent implements OnInit, OnDestroy {
  
  //Controle de Memória e lentidão
  sub: Subscription[] = [];

  // PopUp - Alerta
  @ViewChild(PopPupAlertaComponent, {static: false})
  appPopupAlerta: PopPupAlertaComponent;
  
  @BlockUI() blockUI: NgBlockUI;

  //progressbar
  barraVisible = false;
  barraDesc:String = '';
  barraProgess: number = 0;

  btnDisabled: boolean = false;

  //Checkbox
  btnMinimizar: boolean= false;
  allServico: boolean = false;

  selectServico: SelectServico= {
    name: 'Marcar Todos Caches',
    select: false,
    color: 'primary',
    subtasks: []
  };

  constructor(
    public router: ActivatedRoute,
    private cacheService: CacheService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.getServivos();
  }

  async getServivos(){
    const resultado  = await this.listarCacheAll();
    let id = 0;
    let color = false

    this.selectServico.subtasks = [];
    for (const servico of resultado){
      id += 1;
      this.selectServico.subtasks.push({id: id, name: servico.nome, select: false, color: this.getColor(color)});
      color = color == false ? true : false;
    }
  }

  ngOnDestroy() {
    //Descreva todos os Observable
    this.sub.forEach(s => s.unsubscribe());
    if(this.sub.length > 0) { this.sub = [];}
  }
  
  // ------------------------------------------------------------------------------------

  selecione() {
    this.allServico = this.selectServico.subtasks != null && this.selectServico.subtasks.every(t => t.select);
  }

  selecioneTodos(completed: boolean) {
    this.allServico = completed;
    if (this.selectServico.subtasks == null) {
      return;
    }
    this.selectServico.subtasks.forEach(t => t.select = completed);
  }

  verificaSelecao(): boolean {
    if (this.selectServico.subtasks == null) {
      return false;
    }
    return this.selectServico.subtasks.filter(t => t.select).length > 0 && !this.allServico;
  }

  isValidaSelectServico(): boolean {
    if (this.selectServico.subtasks == null) {
      return false;
    }
    return this.selectServico.subtasks.filter(t => t.select).length > 0;
  }

  setMinimizar(){
    this.btnMinimizar = !this.btnMinimizar;
  }

  getColor(color: Boolean) {
    return color == true ? 'primary':'warn';
  }
  // ------------------------------------------------------------------------------------

  async sincronizarDados() {

    // Comece a bloquear
    //this.blockUI.start('Aguarde a sincronização dos dados..');

    let is = this;

    is.btnDisabled = true;
    is.barraVisible = true;
    is.barraProgess = 0;

    let contServico = 0;
    //Cont servicos selecionados
    for (const servico of is.selectServico.subtasks){
      if ( servico.select) {
        contServico += 1
      }
    }

    contServico = (100/contServico)
    for (const servico of is.selectServico.subtasks){
    
      if ( servico.select) {
        is.barraProgess += (contServico === 3 ? 13 : (contServico === 2 ? 15 : 50));
        is.barraDesc = servico.name;
        
        const resultado  = await this.limparCache(servico.name);
        is.barraProgess += contServico;
        
        if(is.barraProgess >= 99){
          is.btnDisabled = false;
          is.barraDesc = '';
          is.barraProgess = 100;
          //is.blockUI.stop();
          this.getServivos();
          is.appPopupAlerta.showAlerta('AVISO', 'Informação', 'Sincronização dos dados realizada com sucesso');
        }
      }
    }
  }

  limparCache(nome: string): Promise<any> {
    return this.cacheService.limparCache(nome).toPromise();
  }

  listarCacheAll(): Promise<any> {
    return this.cacheService.listarCacheAll().toPromise();
  }
}
