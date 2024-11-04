import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ViewChild } from '@angular/core';
import { PopPupAlertaComponent } from '../../../../../components/popup-alerta/popup-alerta.component';
import { ClienteAnexoService } from '../../../../../services/contrato/clienteanexo/clienteanexo.service';
import { ClienteAnexoView, GRAnexo } from '../../../../../services/contrato/clienteanexo/clienteAnexo';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-anexo-cliente',
  templateUrl: 'anexo-cliente.component.html',
  styleUrls: ['./anexo-cliente.component.css'],
})

export class AnexoClienteComponent implements OnInit, OnDestroy {
  
  // PopUp - Alerta
  @ViewChild(PopPupAlertaComponent, {static: false})
  appPopupAlerta: PopPupAlertaComponent;
  
  @BlockUI() blockUI: NgBlockUI;

  // Array Lista
  public dado: GRAnexo = new GRAnexo();
  public listaDados: ClienteAnexoView[] = new Array();
  public listaDadosOld: ClienteAnexoView[] = new Array();

  checkedAll: boolean = false;
  varExcluirListaPedente: boolean = false;
  varTamanhoTotal: number = 0;

  // Paginação da Grid
  public registro: String;
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
    private ClienteAnexoService: ClienteAnexoService,
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
    this.ClienteAnexoService.getListaAll().subscribe(res => {
      this.dado = res;
      this.listaDados = this.dado.listaAll;
      this.listaDadosOld = this.listaDados;
    });
  }

  gerarBackup(): void {

    // Comece a bloquear
    this.blockUI.start('Aguarde o processamento...');

    this.ClienteAnexoService.gerarBackup().then(relatorio => {

      const blob      = new Blob([relatorio.json()], { type: 'application/octet-stream' });
      const fileUrl   = URL.createObjectURL(blob);

      const anchor    = document.createElement('a');

      const formattedDate     = new DatePipe('pt-BR').transform(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const nomeArquivo = "backuo_clienteAnexo_" + formattedDate + ".zip"

      anchor.download = nomeArquivo;
      anchor.href     = fileUrl;
      anchor.click();

      // Pare de bloquear
      this.blockUI.stop();

    });
  }

  async gerarProcessamento(tipoGeracao: any) {
      // Comece a bloquear
      this.barraDesc = 'Processando...';
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

          //await this.comprimirImagem(item.id);
          await this.gerar(tipoGeracao, item.id);

          await this.verificaSicronizacao(500, item.id);
          this.barraProgess += barra;
          this.barraProgess = +this.barraProgess.toFixed(2);
        }
      }

      this.appPopupAlerta.showAlerta('SUCESSO', 'Informação', 'Compressão realizado com sucesso.');

      this.barraVisible = false;
      this.checkedAll = false;
      this.consultar();
      
  }

  async verificaSicronizacao(tempo: any, id: any) {
    await new Promise( resolve => setTimeout(resolve, tempo));

    const next = await this.isVerificaProcessamento(id);

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

  isVerificaProcessamento(id: any): Promise<any> {
    return this.ClienteAnexoService.isVerificaProcessamento(id).toPromise();
  }

  gerar(tipoGeracao: any, id: any): Promise<any> {
    return this.ClienteAnexoService.gerar(tipoGeracao, id).toPromise();
  }

  consultarRegistro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.localizar(filterValue);
  }

  localizar(registro: String) {
    this.listaDados = this.listaDadosOld.filter(dado => dado.clienteCodigo.toString().toLowerCase().indexOf(registro.toLowerCase()) > -1);
  }
}
