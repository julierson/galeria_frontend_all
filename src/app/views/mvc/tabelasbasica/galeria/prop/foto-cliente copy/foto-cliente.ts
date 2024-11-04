import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ViewChild } from '@angular/core';
import { PopPupAlertaComponent } from '../../../../../components/popup-alerta/popup-alerta.component';
import { ClienteFotoService } from '../../../../../services/contrato/clienteFoto/clientefoto.service';
import { ClienteFotoView } from '../../../../../services/contrato/clienteFoto/clienteFoto';

@Component({
  selector: 'app-foto-cliente',
  templateUrl: 'foto-cliente.component.html',
  styleUrls: ['./foto-cliente.component.css'],
})

export class FotoClienteComponent implements OnInit, OnDestroy {
  
  // PopUp - Alerta
  @ViewChild(PopPupAlertaComponent, {static: false})
  appPopupAlerta: PopPupAlertaComponent;
  
  @BlockUI() blockUI: NgBlockUI;

  // Array Lista
  public listaDados: ClienteFotoView[] = new Array();
  checkedAll: boolean = false;
  varExcluirListaPedente: boolean = false;
  varTamanhoTotal: number = 0;

  // Paginação da Grid
  public paginaAtual    = 1;
  public itensporpagina = 20;
  public qtdmaxpagina   = 20;

  //progressbar
  barraVisible = false;
  barraDesc:String = '';
  barraProgess: number = 0;
  btnDisabled: boolean = false;

  constructor(
    public router: ActivatedRoute,
    private clienteFotoService: ClienteFotoService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.consultar();
  }

  ngOnDestroy() {
    //Descreva todos os Observable
  }
  
  // ------------------------------------------------------------------------------------

  consultar() {
    this.clienteFotoService.getListaAll().subscribe(res => {
      this.listaDados = res;
      for(const item of this.listaDados){
        this.varTamanhoTotal += item.tamanho;
      }
    });
  }

  async comprimir() {
      // Comece a bloquear
      this.barraDesc = 'Gerando...';
      this.barraProgess = 0;

      this.barraVisible = true;

      let contRegistro = 0;
      for(const item of this.listaDados){
        if(item.checked){
          contRegistro += 1
        }
      }

      const barra = (100/contRegistro);

      for(const item of this.listaDados){

        if(item.checked){

          await this.comprimirImagem(item.id);
          await this.verificaSicronizacao(500, item.id);
          this.barraProgess += barra;
          this.barraProgess = +this.barraProgess.toFixed(2);
        }
      }

      this.appPopupAlerta.showAlerta('SUCESSO', 'Informação', 'Compressão realizado com sucesso.');

      this.barraVisible = false;
      this.checkedAll = false;
      this. consultar();
      
  }

  async verificaSicronizacao(tempo: any, id: any) {
    await new Promise( resolve => setTimeout(resolve, tempo));

    const next = await this.isVerificaSicronizacao(id);

    if(next==='false'){
      await this.verificaSicronizacao(tempo, id);
    }

    return new Promise( resolve => setTimeout(resolve, 1));
  }

  checkAllCheckBox(ev) {
    this.checkedAll              = ev.target.checked;
    this.listaDados.forEach(x => x.checked = ev.target.checked )
    this.varExcluirListaPedente = this.listaDados.some(function (x) {if(x.checked == true) return true});
  }

  isAllCheckBoxChecked() {
    this.varExcluirListaPedente = this.listaDados.some(function (x) {if(x.checked == true) return true});
  }

  isVerificaSicronizacao(id: any): Promise<any> {
    return this.clienteFotoService.isVerificaSicronizacao(id).toPromise();
  }

  comprimirImagem(id: any): Promise<any> {
    return this.clienteFotoService.comprimirImagem(id).toPromise();
  }
}
