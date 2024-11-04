import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../../services/gerencia/usuario/usuariodto';
import { Router } from '@angular/router';
import { Permissao } from '../../services/gerencia/configuracao/permissao/permissao';
import { UsuarioPermissao } from '../../services/gerencia/usuario/usuarioPermissoes';
import { CriptoService } from './cripto.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { UsuarioEmpresa } from '../../services/gerencia/usuarioempresa/usuarioempresa';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  usuarioDTO: UsuarioDTO;
  permissao: Permissao[];
  empValorMaximoEmprestimo: number;
  empQtdDiasReagendamento: number;
  usuarioPermissao: UsuarioPermissao[];

  constructor(
    private http: Http,
    public router: Router,
    private cripto: CriptoService
  ) {
  }

  listaEmpresa(usuarioId: number): Observable<UsuarioEmpresa[]> {
    return this.http
    .get(environment.baseUrl + '/usuarioempresa' + '/' + usuarioId + '?access_token=' + JSON.parse(this.getToken()).access_token)
    .map((res: Response) => res.json());
  }

  setToken(dadoLogin: any) {
    sessionStorage.setItem('token', JSON.stringify(dadoLogin));
  }

  getToken() {
    if ( sessionStorage.getItem('token') === null) {
      this.logout();
    }
    return sessionStorage.getItem('token');
  }

  validaErro(error: any) {

    switch (error.status) {
      case 0: {
        /**
         * Nesse caso acontece quando o servidor back-and está fora do ar.
        */
         this.logout();
         break;
      }
      case 401: {
        /**
         * O erro HTTP 401 acontece quando o acesso precisa de autenticação, e esta,
         * em um primeiro momento, não foi fornecida ou foi negada.
         * Nesse caso acontece quando o servidor back-and está fora do ar.
        */
         this.logout();
         break;
      }
      default: {
         break;
      }
   }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  public armazenarUsuario(usuario: UsuarioDTO, isAcessoMaster: boolean) {
    this.permissao                = usuario.permissao;
    this.empValorMaximoEmprestimo = usuario.empValorMaximoEmprestimo;
    this.empQtdDiasReagendamento  = usuario.empQtdDiasReagendamento;

    const is = this;

    is.usuarioPermissao = [];

    for (const item of is.permissao) {
      is.usuarioPermissao.push({pemissao: item.nome});
    }

    /*
    is.permissao.forEach(function(item) {
      is.usuarioPermissao.push({pemissao: item.nome});
    });
    */

    if ( usuario.nickname !== null) {
      sessionStorage.setItem('usuarioNickName', usuario.nickname.toString());
    } else {
      sessionStorage.setItem('usuarioNickName', '');
    }

    const token = JSON.parse(this.getToken()).access_token;
    sessionStorage.setItem(this.cripto.Criptografa(token, 'usuarioDTO'), this.cripto.Criptografa(token, JSON.stringify(usuario)));
    sessionStorage.setItem(this.cripto.Criptografa(token, 'usuarioMaster'), this.cripto.Criptografa(token, usuario.master.toString()));

    if(isAcessoMaster === true) {
      sessionStorage.removeItem(this.cripto.Criptografa(token, 'usuarioMasterEmp'));
      sessionStorage.setItem(this.cripto.Criptografa(token, 'usuarioMasterEmp'), this.cripto.Criptografa(token, 'true'));
    }else{
      sessionStorage.setItem(this.cripto.Criptografa(token, 'usuarioMasterEmp'), this.cripto.Criptografa(token, usuario.master.toString()));
    }

    sessionStorage.setItem(this.cripto.Criptografa(token, 'usuarioPermissao'), this.cripto.Criptografa(token, is.usuarioPermissao));

    sessionStorage.setItem(this.cripto.Criptografa(token, 'empValorMaximoEmprestimo'),
    this.cripto.Criptografa(token, this.empValorMaximoEmprestimo));

    sessionStorage.setItem(this.cripto.Criptografa(token, 'empQtdDiasReagendamento'),
    this.cripto.Criptografa(token, this.empQtdDiasReagendamento));

    //Validação das empresas vinculadas ao usuario.
    if(usuario.master){
      this.router.navigate(['/galeria/prop']);
    }else{

      this.listaEmpresa(usuario.id).subscribe(res => {

        this.setNumEmpresa(res.length);

        if(res.length == 1){
          for( const dado of res){
            this.setIdEmpresa(dado.usuarioEmpresaId.empresa.id);
            this.setEmpresaNome(dado.usuarioEmpresaId.empresa.nome);
            this.setUtilizaCodigoCliente(dado.usuarioEmpresaId.empresa.utilizaCodigoCliente);
            this.router.navigate(['/galeria/prop']);
          }
        }else{

          if(isAcessoMaster){
            //Quando a requisição foi solicitada novamente pelo Master
            this.router.navigate(['/galeria/prop']);
          }else{
             this.router.navigate(['/listaempresa']);
          }
        }
      });
    }
  }

  // Get Set Dados referente a usuario -------------------------------------------------------------------

  isUsuarioMaster() {
    // return JSON.parse(sessionStorage.getItem('usuarioMaster'));
    const token = JSON.parse(this.getToken()).access_token;
    const dado = this.cripto.Descriptografa(token, sessionStorage.getItem(this.cripto.Criptografa(token, 'usuarioMaster')));
    return  JSON.parse(this.getJSON(dado));
  }

  isUsuarioMasterEmp() {
    // return JSON.parse(sessionStorage.getItem('usuarioMaster'));
    const token = JSON.parse(this.getToken()).access_token;
    const dado = this.cripto.Descriptografa(token, sessionStorage.getItem(this.cripto.Criptografa(token, 'usuarioMasterEmp')));
    return  JSON.parse(this.getJSON(dado));
  }

  obterPermissaoUsuarioLogado() {
    // return JSON.parse(sessionStorage.getItem('usuarioPermissao'));
    const token = JSON.parse(this.getToken()).access_token;
    const dado = this.cripto.Descriptografa(token, sessionStorage.getItem(this.cripto.Criptografa(token, 'usuarioPermissao')));
    return this.getJSON(dado);
  }

  setNickName(nickName: String) {
    sessionStorage.setItem('usuarioNickName', nickName.toString());
  }

  getNickName() {
    return sessionStorage.getItem('usuarioNickName');
  }

  getUserName() {
    // this.usuarioDTO = JSON.parse(sessionStorage.getItem('usuario'));
    const token = JSON.parse(this.getToken()).access_token;
    const dado = this.cripto.Descriptografa(token, sessionStorage.getItem(this.cripto.Criptografa(token, 'usuarioDTO')));
    this.usuarioDTO = this.getJSON(dado);
    return this.usuarioDTO.username;
  }

  getIdUsuario() {
    // this.usuarioDTO = JSON.parse(sessionStorage.getItem('usuario'));
    const token = JSON.parse(this.getToken()).access_token;
    const dado = this.cripto.Descriptografa(token, sessionStorage.getItem(this.cripto.Criptografa(token, 'usuarioDTO')));
    this.usuarioDTO = this.getJSON(dado);
    return this.usuarioDTO.id;
  }

  getUsuarioDTO() {
    // return JSON.parse(sessionStorage.getItem('usuarioDTO'));
    const token = JSON.parse(this.getToken()).access_token;
    const dado = this.cripto.Descriptografa(token, sessionStorage.getItem(this.cripto.Criptografa(token, 'usuarioDTO')));
    this.usuarioDTO = this.getJSON(dado);
    return this.usuarioDTO ;
  }

  getJSON(value) {
    let dado = JSON.parse(JSON.stringify(value.replace(/[\\]/g, '').replace('""', '')));
    dado = dado.replace('"{', '{').replace('}"', '}');
    return JSON.parse(dado);
  }

  // Get Set Dados referente a empresa -------------------------------------------------------------------

  setNumEmpresa(numEmpresa: number) {
    sessionStorage.setItem('NumEmpresa', numEmpresa.toString());
  }

  getNumEmpresa() {
    return Number(sessionStorage.getItem('NumEmpresa'));
  }

  setEmpresaNome(empresaNome: String) {
    sessionStorage.setItem('EmpresaNome', empresaNome.toString());
  }

  getEmpresaNome() {
    return sessionStorage.getItem('EmpresaNome');
  }

  setIdEmpresa(IdEmpresa: number) {
    const token = JSON.parse(this.getToken()).access_token;
    sessionStorage.setItem(this.cripto.Criptografa(token, 'IdEmpresa'), this.cripto.Criptografa(token, IdEmpresa.toString()));
  }

  getIdEmpresa() {
    const token = JSON.parse(this.getToken()).access_token;

    const value = sessionStorage.getItem(this.cripto.Criptografa(token, 'IdEmpresa'));
    const dado = value != null ? this.cripto.Descriptografa(token, value) : "";

    return Number(dado.replace('"', '').replace('"', ''));
  }

  setUtilizaCodigoCliente(utilizaCodigoCliente: any) {
    const token = JSON.parse(this.getToken()).access_token;
    sessionStorage.setItem(this.cripto.Criptografa(token, 'UtilizaCodigoCliente'), this.cripto.Criptografa(token, utilizaCodigoCliente.toString()));
  }

  getUtilizaCodigoCliente() : boolean {
    const token = JSON.parse(this.getToken()).access_token;
    
    const value = sessionStorage.getItem(this.cripto.Criptografa(token, 'UtilizaCodigoCliente'));
    const dado = value != null ? this.cripto.Descriptografa(token, value) : "";

    const resultado = dado === '"true"' ? true : false;
    return resultado;
  }

  getEmpValorMaximoEmprestimo() {
    const token = JSON.parse(this.getToken()).access_token;

    const value = sessionStorage.getItem(this.cripto.Criptografa(token, 'empValorMaximoEmprestimo'));
    const dado = value != null ? this.cripto.Descriptografa(token, value) : "";

    return Number(dado.replace('"', '').replace('"', ''));
  }

  getEmpQtdDiasReagendamento() {
    const token = JSON.parse(this.getToken()).access_token;

    const value = sessionStorage.getItem(this.cripto.Criptografa(token, 'empQtdDiasReagendamento'));
    const dado = value != null ? this.cripto.Descriptografa(token, value) : "";

    return Number(dado.replace('"', '').replace('"', ''));
  }
}
