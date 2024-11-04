import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { CamposObr } from './camposObr';
import { AlertConfig } from 'ngx-bootstrap/alert';

import { Usuario } from '../../../../services/gerencia/usuario/usuario';
import { UsuarioService } from '../../../../services/gerencia/usuario/usuario.service';
import { PopPupAlertaComponent } from '../../../../components/popup-alerta/popup-alerta.component';

// Importe para campo Imput com consulta
import { Subject, Observable, merge, Subscription } from 'rxjs';
import {debounceTime, map, distinctUntilChanged, filter} from 'rxjs/operators';
import {  NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// Importe para campo Imput com consulta

import { Empresa } from '../../../../services/gerencia/empresa/empresa';
import { EmpresaService } from '../../../../services/gerencia/empresa/empresa.service';
import { AutenticacaoService } from '../../../../components/Seguranca/autenticacao.service';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ReadyService } from '../../../../components/ready.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-meusdados',
  templateUrl: './meusdados.component.html',
  styleUrls: ['./meusdados.component.css'],

  // Necessita para Mensagem de Alert
  providers: [{ provide: AlertConfig}]
})

export class MeusDadosComponent implements OnInit, OnDestroy {

  //Controle de Memória e lentidão
  sub: Subscription[] = [];

  // Variáveis ngModel
  varEmpresa: Empresa;
  varNickName: String;
  varUsername: String;
  varPassword: String;

  // Propriedade para tratamento dos campos
  // > Alert Mensagem
  alerts: String = null;
  alertsBackEnd: Array<any> = [];

  // > Validação dos campos obrigatórios
  isCamposObr: boolean = false;
  campoobrigatorio = CamposObr;
  isCampoDisabled: boolean = false;
  isCampoDisabledEmpresa: boolean = false;
  classVarEmpresa  = {};
  classVarNickName = {};
  classVarUsername = {};
  classVarPassword = {};

  // Instancia das propriedades do objeto
  dado: Usuario;
  empresaId: number;
  // PopUp - Alerta
  @ViewChild(PopPupAlertaComponent, {static: false})
  appPopupAlerta: PopPupAlertaComponent;

  // Inputs com Pesquisa -------------------------[
  @ViewChild('instance', { static: false}) instance: NgbTypeahead;
  click$ = new Subject<string>();
  focusEmpresa$ = new Subject<string>();
  listaEmpresa: Empresa[] = new Array();


  // File Upload ---------------------------------[
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = 'assets/img/avatars/default.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  urlAvatar: any = 'assets/img/avatars/default.png';
  isUrlAvatar: boolean = true;
  fileAvatar: File;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private autenticacao: AutenticacaoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private service: UsuarioService,
    private empresaService: EmpresaService,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private readyService: ReadyService,
    ) { }

  ngOnInit(): void {
    this.getListaEmpresa();
    this.getDadoUsuario();
    this.getAvatar();

    // Limpa as validações
    this.classVarNickName = {'form-control is-invalid': true};
    this.campoobrigatorio.find(item => item.campo === 'varNickName').erro = false;

    this.classVarUsername = {'form-control is-invalid': true};
    this.campoobrigatorio.find(item => item.campo === 'varUsername').erro = false;

    this.classVarPassword = {'form-control is-invalid': true};
    this.campoobrigatorio.find(item => item.campo === 'varPassword').erro = false;

    this.isCampoDisabled = false;
    this.varUsername    = 'this.url.dado.username';
    this.varPassword    = '';
  }

  ngOnDestroy() {
    //Descreva todos os Observable
    this.sub.forEach(s => s.unsubscribe());
    if(this.sub.length > 0) { this.sub = [];}
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

  getListaEmpresa() {
    this.sub.push(
      this.empresaService.consultar(null).subscribe(res => {
        this.listaEmpresa = res;
        this.varEmpresa = this.listaEmpresa.find(item => item.id === this.autenticacao.getIdEmpresa());
        this.isCampoDisabledEmpresa = true;
      })
    );
  }

  getDadoUsuario() {
    this.sub.push(this.service.consultar(this.autenticacao.getUserName()).subscribe(res => {
        if (res.find(item => item.id === this.autenticacao.getIdUsuario()) !== undefined) {
          this.dado         = res.find(item => item.id === this.autenticacao.getIdUsuario());
          this.varNickName  = this.dado.nickname;
          this.varUsername  = this.dado.username;
        }
      })
    );
  }

  // Validação ao sair do campo
  isValidaCampo(campo: String) {
    this.isCamposObr = false;

    if (campo === 'varNickName' || campo === '') {
      campo = 'varNickName';
      if (this.varNickName === '' || this.varNickName === undefined) {
        this.campoobrigatorio.find(item => item.campo === campo).erro = true;
        this.classVarNickName = { 'form-control is-invalid': true};
      } else {
        this.campoobrigatorio.find(item => item.campo === campo).erro = false;
        this.classVarNickName = { 'form-control': true};
      }
      campo = '';
    }

    if (campo === 'varUsername' || campo === '') {
      campo = 'varUsername';
      if (this.varUsername === '' || this.varUsername === undefined) {
        this.campoobrigatorio.find(item => item.campo === campo).erro = true;
        this.classVarUsername = { 'form-control is-invalid': true};
      } else {
        this.campoobrigatorio.find(item => item.campo === campo).erro = false;
        this.classVarUsername = { 'form-control': true};
      }
      campo = '';
    }
  }

  // Validação ao execultar o click
  validaCampo() {
    this.isValidaCampo('');

    if (this.varNickName === '' || this.varNickName === undefined
    || this.varUsername === '' || this.varUsername === undefined) {
      return true;
    }
  }

  visualizarFoto() {
    const username = this.autenticacao.getUserName() + '';
    this.service.getAvatar(username).then(relatorio => {
      const blob        = new Blob([relatorio.json()], { type: 'image/png' });

      let urlAvatar: any = 'assets/img/avatars/default.png';
      if (blob.size > 0 ) {
        urlAvatar    = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
      this.appPopupAlerta.showFoto('', urlAvatar);
     });
  }

  getAvatar() {
    const username = this.autenticacao.getUserName() + '';
    this.service.getAvatar(username).then(relatorio => {
      const blob        = new Blob([relatorio.json()], { type: 'image/png' });

      if (blob.size > 0 ) {
        this.urlAvatar    = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
     });
  }

  uploadFile(event) {
    const reader    = new FileReader(); // HTML5 FileReader API
    const file      = event.target.files[0];
    this.fileAvatar = file;

    if (event.target.files && event.target.files[0]) {

      // Quando o upload de arquivos é definido como arquivo formcontrol
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl     = reader.result;
        this.editFile     = false;
        this.removeUpload = true;
        this.isUrlAvatar  = false;
      };
      // ChangeDetectorRef pois o arquivo está carregando fora da zona
      this.cd.markForCheck();
    }
  }

  retornoPopUp() {

  }

  salvar() {
    this.alerts = null;
    if (this.validaCampo() === true) {
      this.isCamposObr = true;
      return;
    }

    // Dados da Tela
    this.dado.nickname  = this.varNickName;
    this.dado.username  = this.varUsername;
    this.dado.password  = this.varPassword;

    // Atualização

    // Comece a bloquear
    this.blockUI.start('Aguarde o processamento...');

    this.sub.push(
      this.service.update(this.dado).subscribe(response => {
        this.autenticacao.setNickName(this.dado.nickname);

        if (this.fileAvatar !== undefined) {
          this.service.setAvatar(this.dado.id, this.fileAvatar).then( relatorio => {
            this.readyService.atualizarDadosUsuario();
          });
          this.readyService.atualizarDadosUsuario();
        }

        // Pare de bloquear
        this.blockUI.stop();

        this.appPopupAlerta.showAlerta('SUCESSO', 'Informação', 'Seus dados alterado com sucesso.');
      }, (erro => {

        // Pare de bloquear
        this.blockUI.stop();

        this.alertsBackEnd  = erro.json();
      }))
    );
  }

  public closeAlert(alert: any) {
    const index: number = this.alertsBackEnd.indexOf(alert);
    this.alertsBackEnd.splice(index, 1);
  }
}
