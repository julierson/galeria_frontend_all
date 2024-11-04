import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ViewChild } from '@angular/core';

//--------------------------------------------
// Importe para campo Imput com consulta
import { Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';


//--------------------------------------------
import { Administracao } from '../../../../../services/tabelasbasica/logsistema/administracao.service';
import { PopPupAlertaComponent } from '../../../../../components/popup-alerta/popup-alerta.component';

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
  enum: string;
  select: boolean;
  color: ThemePalette;
}

@Component({
  selector: 'app-sinc-dados',
  templateUrl: 'sinc-dados.component.html',
  styleUrls: ['./sinc-dados.component.css'],
})

export class SincDadosComponent implements OnInit, OnDestroy {
  
  //Controle de Memória e lentidão
  sub: Subscription[] = [];

  // PopUp - Alerta
  @ViewChild(PopPupAlertaComponent, {static: false})
  appPopupAlerta: PopPupAlertaComponent;
  
  @BlockUI() blockUI: NgBlockUI;

  clock: any;

  //progressbar
  barraVisible = false;
  barraDesc:String = '';
  barraProgess: number = 0;

  btnDisabled: boolean = false;

  //Checkbox
  btnMinimizar: boolean= false;
  allServico: boolean = false;

  selectServico: SelectServico= {
    name: 'Marcar Todos Serviços',
    select: false,
    color: 'primary',
    subtasks: []
  };

  constructor(
    public router: ActivatedRoute,
    private administracao: Administracao
  ) {}

  ngOnInit(): void {
    this. getServivos();
  }

  getServivos(){
    this.selectServico.subtasks.push({id: 3, name: 'Juros Por Atraso', enum: 'JUROS_POR_ATRASO', select: false, color: this.getColor(false)});
    this.selectServico.subtasks.push({id: 2, name: 'Status Do Cliente', enum: 'STATUS_DO_CLIENTE', select: false, color: this.getColor(true)});
    this.selectServico.subtasks.push({id: 1, name: 'Gráfico', enum: 'GRAFICO',  select: false, color: this.getColor(false)});
    this.selectServico.subtasks.push({id: 4, name: 'Dados Relatórios', enum: 'DADO_RELATORIO',  select: false, color: this.getColor(false)});
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

  async finalizar() {

    // Comece a bloquear
    this.blockUI.start('Aguarde...');

    await this.finalizaSincronizacao();

    this.appPopupAlerta.showAlerta('AVISO', 'Informação', 'Sincronização finalizado com sucesso');

    // Pare de bloquear
    this.blockUI.stop();
  }

  async sincronizar() {

    // Comece a bloquear
    let is = this;
    let contServico = 0;
    is.btnDisabled = true;
    is.barraVisible = true;
    is.barraProgess = 0;

    //Cont servicos selecionados
    for (const servico of is.selectServico.subtasks){
      if ( servico.select) {
        contServico += 1
      }
    }

    let barraProgess = 0;
    switch ( contServico ) {
        case 1:
            barraProgess = 100;
            break;

          case 2:
            barraProgess = (100/2);
            break;

          case 3:
            barraProgess = (100/3);
            break;

          case 4:
            barraProgess = (100/4);
            break;

        default: 
            barraProgess = 100;
            break;
    }

    for(const servico of is.selectServico.subtasks) {
      
      if (servico.select) {

        is.barraDesc = 'Gerando ' + servico.name + '...';
        is.barraProgess += +(barraProgess/2).toFixed(0);
       
        const idSicronismo  = await this.sincronizaDados(servico.enum);

        // A cada 30 segundos faça verificação
        await this.verificaSicronizacao(30000, idSicronismo);
        
        is.barraProgess += +(barraProgess/2).toFixed(0);

        if(idSicronismo === 0) {
          is.btnDisabled = false;
          is.barraProgess = 100;
          
          //is.blockUI.stop();
          is.appPopupAlerta.showAlerta('ALERTA', 'Alerta', 'Falha na sincronização do serviço (' + servico.name + ')');
          return;
        }

        if(is.barraProgess >= 99){
          is.btnDisabled = false;
          is.barraDesc = '';
          is.barraProgess = 100;
          //is.blockUI.stop();
          is.appPopupAlerta.showAlerta('AVISO', 'Informação', 'Sincronização dos dados realizada com sucesso');
        }
      }
    }
  }

  sincronizaDados(servico: any): Promise<any> {
    return this.administracao.sincronizaDados(servico).toPromise();
  }

  finalizaSincronizacao(): Promise<any> {
    return this.administracao.finalizaSincronizacao().toPromise();
  }

  isVerificaSicronizacao(id: any): Promise<any> {
    return this.administracao.isVerificaSicronizacao(id).toPromise();
  }

  delay(tempo: any) {
    return new Promise( resolve => setTimeout(resolve, tempo) );
  }

  async verificaSicronizacao(tempo: any, id: any) {
    await new Promise( resolve => setTimeout(resolve, tempo));

    const next = await this.isVerificaSicronizacao(id);

    if(next==='false'){
      await this.verificaSicronizacao(tempo, id);
    }

    return new Promise( resolve => setTimeout(resolve, 1));
  }
}
