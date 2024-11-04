import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { CamposObr } from './camposObr';
import { LoginService } from '../services/login/login.service';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { UsuarioService } from '../services/gerencia/usuario/usuario.service';
import { UsuarioDTO } from '../services/gerencia/usuario/usuariodto';
import { AutenticacaoService } from '../components/Seguranca/autenticacao.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],

  // Necessita para Mensagem de Alert
  providers: [{ provide: AlertConfig}]
})

export class LoginComponent implements OnInit, OnDestroy {
  
  //Controle de Memória e lentidão
  sub: Subscription[] = [];
   
  alerts: String = null;
  loginUser: String;
  loginSenha: String;
  isValidandoAcesso: boolean = false;
  public usuarioDTO: UsuarioDTO[];

  isCamposObr: boolean = false;
  campoobrigatorio = CamposObr;
  btnLogin: boolean = false;
  constructor(
     private loginService: LoginService,
     private usuarioService: UsuarioService,
     private autenticacaoService: AutenticacaoService,
     public router: Router
    ) {
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  ngOnDestroy() {
    //Descreva todos os Observable
    this.sub.forEach(s => s.unsubscribe());
    if(this.sub.length > 0) { this.sub = [];}
  }

  // Validação ao sair do campo
  isValidaCampo(campo: String) {
    this.isCamposObr = false;
    if (campo === 'loginUser') {
      if (this.loginUser === '' || this.loginUser === undefined) {
        this.campoobrigatorio.find(item => item.campo === campo).erro = true;
      } else {
        this.campoobrigatorio.find(item => item.campo === campo).erro = false;
      }
    }

    if (campo === 'loginSenha') {
      if (this.loginSenha === '' || this.loginSenha === undefined) {
        this.campoobrigatorio.find(item => item.campo === campo).erro = true;
      } else {
        this.campoobrigatorio.find(item => item.campo === campo).erro = false;
      }
    }
  }

  // Validação ao execultar o click
  validaCampo() {
    if (this.loginUser === '' || this.loginUser === undefined) {
      this.campoobrigatorio.find(item => item.campo === 'loginUser').erro = true;
      this.isCamposObr = true;
    } else {
      this.campoobrigatorio.find(item => item.campo === 'loginUser').erro = false;
    }

    if (this.loginSenha === '' || this.loginSenha === undefined) {
      this.campoobrigatorio.find(item => item.campo === 'loginSenha').erro = true;
      this.isCamposObr = true;
    } else {
      this.campoobrigatorio.find(item => item.campo === 'loginSenha').erro = false;
    }

    if (
      this.loginUser === '' || this.loginUser === undefined ||
      this.loginSenha === '' || this.loginSenha === undefined
    ) { return true; }
  }

  acessar() {
    this.alerts = null;

    if (this.validaCampo() === true) {
      return;
    }

    this.isValidandoAcesso = true;
    const body = new HttpParams().set('username', this.loginUser.toString()).set('password', this.loginSenha.toString()).set('grant_type', 'password');

    this.btnLogin = true;
    this.sub.push(
      this.loginService.login(body.toString()).subscribe(token => {

        this.autenticacaoService.setToken(token);

        this.sub.push(
            this.usuarioService.getUsuarioLogin(this.loginUser).subscribe( dadoUsuario => {
              
              if(!dadoUsuario.bloqueado){
                this.autenticacaoService.armazenarUsuario(dadoUsuario, false); 
              }else{
                this.alerts = 'Acesso bloqueado, devido a atraso no pagamento da mensalidade!';
                this.btnLogin = false;
                this.isValidandoAcesso = false;
              }
           
          }, error => {
            this.btnLogin = false;
            this.router.navigate(['/errorlogin']);
            this.alerts = 'Falha na busda dos dados do usuario!';

            this.btnLogin = false;
            this.isValidandoAcesso = false;
          })
        );

      }, error => {

        if (error.status === 0) {
          this.alerts = 'Ops, Solicitamos que entre em contato com o administrador!';
        } else{
          this.alerts = 'Usuário ou senha inválidos!';
        }
        this.btnLogin = false;
        this.isValidandoAcesso = false;
      })
    );
  }
}
