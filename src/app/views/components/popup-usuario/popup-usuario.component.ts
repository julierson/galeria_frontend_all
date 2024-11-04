import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Empresa } from '../../services/gerencia/empresa/empresa';

import { Usuario } from '../../services/gerencia/usuario/usuario';
import { UsuarioService } from '../../services/gerencia/usuario/usuario.service';
import { UsuarioEmpresaService } from '../../services/gerencia/usuarioempresa/usuarioempresa.service';
import { AutenticacaoService } from '../Seguranca/autenticacao.service';

@Component({
  selector: 'app-popup-usuario',
  templateUrl: 'popup-usuario.component.html',
  styleUrls: ['./popup-usuario.component.css'],
})

export class PopUpUsuarioComponent implements OnInit {
  
  //Controle de Memória e lentidão
  sub: Subscription[] = [];

  @ViewChild('modalUsuario') public modalUsuario: ModalDirective;
  @Output() retorno = new EventEmitter();

  tituloModal: string;
  btnDisabled: boolean = false;

  empresa: Empresa;
  loginUser: String;
 
  // Array Lista
  public listaDados: Usuario[] = new Array();
  
  // Controle do campo alerta
  alertsBackEnd: Array<any> = [];

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    public autenticacaoService: AutenticacaoService,
    private usuarioService: UsuarioService,
    private usuarioEmpresaService: UsuarioEmpresaService,
  ) {}

  ngOnInit(): void {
  }

  // Pop-Up Google Map
  show(empresa: Empresa) {
    
    this.empresa = empresa;
    this.listaUsuario();
    this.tituloModal      = 'EMPRESA ' + this.empresa.nome;
   
  }

  listaUsuario() {
    // Comece a bloquear
    this.blockUI.start('Carregando os usuários da empresa...');

    //Lista apenas os usuarios vinculado para empresa.
    this.sub.push(
      this.usuarioEmpresaService.listaUsuarioPorEmpresa(this.empresa.id).subscribe(res => {
        this.listaDados = []//Limpa coleção

        this.listaDados.push({id: 0, username: 'crmadmin', password: '*******',  nickname: 'Administrador', 
        perfil: null, idUsuario: 0, acessoApp: false, sisEmpresa: null});

          for( const dado of res){
              this.listaDados.push(
                {
                  id: dado.usuarioEmpresaId.usuario.id, 
                  username: dado.usuarioEmpresaId.usuario.username,
                  password: '*******',  
                  nickname: dado.usuarioEmpresaId.usuario.nickname, 
                  perfil: null, idUsuario: 0, acessoApp: false, sisEmpresa: null
                }
              );
          }

          // Pare de bloquear
          this.blockUI.stop();
          this.modalUsuario.show();
      })
    );
  }

  setDadoUsuario(loginUser: String){
    this.btnDisabled = true;

    this.sub.push(
      this.usuarioService.getUsuarioLogin(loginUser).subscribe( dadoUsuario => {
        this.autenticacaoService.armazenarUsuario(dadoUsuario, true);
        this.btnDisabled = false;

        this.autenticacaoService.setEmpresaNome(this.empresa.nome);
        this.autenticacaoService.setIdEmpresa(this.empresa.id);
        this.autenticacaoService.setUtilizaCodigoCliente(this.empresa.utilizaCodigoCliente);

        this.fechar();
        location.reload();
      })
    );
  }

  getSessao(dado: any) {
   this.loginUser = dado.username; 
  }

  reload() {
    this.alertsBackEnd = [];

    if(this.loginUser === undefined){

      this.alertsBackEnd = [{id: 1, message: 'Erro: Selecione uma opção abaixo.', type: 'danger'}];
      return;
    }
   
    if (this.empresa.id > 0 ) {
      this.setDadoUsuario(this.loginUser);
    }
  }

  fechar() {
    //Descreva todos os Observable
    this.sub.forEach(s => s.unsubscribe());
    if(this.sub.length > 0) { this.sub = [];}
    this.modalUsuario.hide();
  }

  public closeAlert(alert: any) {
    const index: number = this.alertsBackEnd.indexOf(alert);
    this.alertsBackEnd.splice(index, 1);
  }
}
