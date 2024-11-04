import { DatePipe } from '@angular/common';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ReadyService } from '../../views/components/ready.service';
import { AutenticacaoService } from '../../views/components/Seguranca/autenticacao.service';
import { Cliente } from '../../views/services/contrato/cliente/cliente';
import { ClienteService } from '../../views/services/contrato/cliente/cliente.service';
import { Empresa } from '../../views/services/gerencia/empresa/empresa';
import { EmpresaService } from '../../views/services/gerencia/empresa/empresa.service';
import { UsuarioService } from '../../views/services/gerencia/usuario/usuario.service';
import { PopUpUsuarioComponent } from '../../views/components/popup-usuario/popup-usuario.component';
import { SisEmpresaService } from '../../views/services/gerencia/sisempresa/sisempresa.service';
import { SisEmpresa } from '../../views/services/gerencia/sisempresa/sisempresa';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})

export class DefaultLayoutComponent  implements OnInit, OnDestroy {

  public routeLoading: boolean = false;
  public listaAniversariantes: Cliente[] = new Array();

  //Controle de Memória e lentidão
  sub: Subscription[] = [];
  
  diasAVencer: number = 0;
  valorMensalidade: number;
  varCumprimento: String = '';
  varUserName: String = '';
  varUsuarioMaster: boolean = false;
  varUrlAvatar: any = 'assets/img/avatars/default_.png';

  // Exculta o metodo quando chamado.
  readyDadosUsuario = new Subject();
  readyListaAniversariante = new Subject();

  // Inputs com Pesquisa -------------------------[
  varNumEmpresa: number = 0;
  varNomeEmpresa: String = null;
  varSisEmpresa: String = 'SIS EMPRESAS';
  varEmpresa: String = 'EMPRESAS';
  listaEmpresa: Empresa[] = new Array();
  listaSisEmpresa: SisEmpresa[] = new Array();

  // PopUp - Google Mapa
  @ViewChild(PopUpUsuarioComponent, {static: false}) appUsuario: PopUpUsuarioComponent;

  constructor(
    private router: Router,
    private empresaSisService: SisEmpresaService,
    private empresaService: EmpresaService,
    private autenticacaoService: AutenticacaoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private readyService: ReadyService,
    
   ) {

    /*
    Objetivo: Identificar quando a transição de rota começa e quando ela termina,
    para que saibamos quando mostrar e quando esconder o aviso de “aguarde”.
    */
   this.sub.push(
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.routeLoading = true;
        }

        if (event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError) {
            this.routeLoading = false;
        }
      })
    );
  }

  ngOnInit(): void {
    // Expira session em 5 minuto... por inatividade
    /*
    this.sub.push(
      this.idleService.startWatching(300).subscribe((isUserInactive) => {
        if (isUserInactive) {
          const currentRoute = this.router.url;
          if (currentRoute !== '/login') {
            this.idleService.resetTimer();
            this.idleService.stopTimer();
            this.router.navigateByUrl('/login');
          }

        }
      })
    );
    */

    // app-header---------------------------------------------------------------------------
    this.varNumEmpresa =  this.autenticacaoService.getNumEmpresa();
    this.varNomeEmpresa =  this.autenticacaoService.getEmpresaNome();
    this.varUsuarioMaster = this.autenticacaoService.isUsuarioMasterEmp();
    
    const horas = new Date().getHours();
    if (horas >= 6 && horas <= 12) {
      this.varCumprimento = 'Bom dia, ';
    } else if (horas >= 13 && horas <= 18) {
      this.varCumprimento = 'Boa tarde, ';
    } else {
      this.varCumprimento = 'Boa noite, ';
    }

    this.readyService.readyListaAniversariante(this.readyListaAniversariante);
    this.readyService.atualizarListaAniversariante();

    this.sub.push(
      this.readyDadosUsuario.subscribe(() => {
        this.varUserName = this.autenticacaoService.getNickName();
        this.getAvatar();
      })
    );

    this.readyService.readyDadosUsuario(this.readyDadosUsuario);
    this.readyService.atualizarDadosUsuario();
    
    this.getListaEmpresa();

    if (this.autenticacaoService.getEmpresaNome() !== null) {
      this.varEmpresa =  this.autenticacaoService.getIdEmpresa() + " - " + this.autenticacaoService.getEmpresaNome();
    }
  }

  ngOnDestroy() {
    //Descreva todos os Observable
    this.sub.forEach(s => s.unsubscribe());
    if(this.sub.length > 0) { this.sub = [];}
  }

  getAvatar() {
    const username = this.autenticacaoService.getUserName() + '';
    this.usuarioService.getAvatar(username).then(relatorio => {
      const blob = new Blob([relatorio.json()], { type: 'image/png' });
      if (blob.size > 0 ) {
        this.varUrlAvatar = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
     });
  }

  getAvatarAniverssariante(username: any): any{
    this.usuarioService.getAvatar(username).then(relatorio => {
      const blob = new Blob([relatorio.json()], { type: 'image/png' });
      if (blob.size > 0 ) {
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
     });
  }

  getListaSisEmpresa(sisEmpresaId: number) {

    this.sub.push(
      this.empresaSisService.consultarTodos().subscribe(res => {
        this.listaSisEmpresa = res;
      
        for(const dado of this.listaSisEmpresa){
          if(dado.id == sisEmpresaId){
            this.varSisEmpresa   = dado.id + " - " + dado.nome;
            return;
          }
        }
      }, (error => {
        this.autenticacaoService.validaErro(error);
      }))
    );
  }

  setaSisEmpresa(dado: SisEmpresa) {
    this.listaEmpresa = [];
    this.getListaEmpresa();
  }

  getListaEmpresa() {
    this.sub.push(
      this.empresaService.consultarTodos().subscribe(res => {
        this.listaEmpresa = res;
      }, (error => {
        this.autenticacaoService.validaErro(error);
      }))
    );
  }

  setaEmpresa(empresa: Empresa) {

    this.autenticacaoService.setEmpresaNome(empresa.nome);
    this.autenticacaoService.setIdEmpresa(empresa.id);
    this.autenticacaoService.setUtilizaCodigoCliente(empresa.utilizaCodigoCliente);
    //this.appUsuario.show(empresa);
    location.reload();
  }

  link(link: String) {

    if (link === 'CLIENTE') {
      this.router.navigate(['/minhaconta/meusdados']);
    }

    if (link === 'ALTERARSENHA') {
      this.router.navigate(['/minhaconta/meusdados']);
    }

    if (link === 'LISTAEMPRESA') {
      this.router.navigate(['/listaempresa']);
    }

    if (link === 'SAIR') {
      this.autenticacaoService.logout();
    }
  }

  linkCliente(cliente: Cliente) {
    this.router.navigate(['/contrato/cliente', 
      {nome: cliente.nome, cpf: cliente.cpf, listaNegra: cliente.listaNegra}],
      {skipLocationChange: true}
    );
  }
}