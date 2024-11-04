import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../../../views/services/gerencia/usuario/usuariodto';
import { UsuarioPermissao } from '../../../views/services/gerencia/usuario/usuarioPermissoes';
import { AutenticacaoService } from './autenticacao.service';

@Injectable({
  providedIn: 'root'
})

export class AutorizacaoService {

  usuarioDTO: UsuarioDTO;
  usuarioPermissao: UsuarioPermissao[];
  constructor(private autenticacaoService: AutenticacaoService) {}

  menuPermissao(permissoes: String[]) {
    if (this.autenticacaoService.isUsuarioMaster() === true && this.autenticacaoService.getIdEmpresa() === 0
         && (
            permissoes.find(item => item === 'EMPRESA') 
         || permissoes.find(item => item === 'SISEMPRESA')
         || permissoes.find(item => item === 'PERMISSAO')  
         || permissoes.find(item => item === 'PERFIL')
         || permissoes.find(item => item === 'USUARIO')
         || permissoes.find(item => item === 'FUNCIONARIO')
         )
         !== undefined) {
        return '';
    }

    if (this.autenticacaoService.isUsuarioMaster() === true && this.autenticacaoService.getIdEmpresa() > 0) {
      return '';
    }

    this.usuarioPermissao = [];
    this.usuarioPermissao = this.autenticacaoService.obterPermissaoUsuarioLogado();

    let retorno = 'd-none';

    if (this.usuarioPermissao) {

        // Nome de cada Objeto Tela
        const listaPermissoes = permissoes;

        // Ações das telas
        const acoes = ['CADASTRAR', 'EDITAR', 'EXCLUIR', 'VISUALIZAR'];
        const is    = this;
        listaPermissoes.some(function (valuePermissao) {
            if (acoes.some(function (valueAcao) {
                return is.usuarioPermissao.find(item => item.pemissao === valuePermissao + valueAcao
                  || item.pemissao === valuePermissao) !== undefined;
            })) {
                retorno = '';
            }
        });
    }
    return retorno;
  }

  rotaPermissao(permissoes: String[]) {
    if (this.autenticacaoService.isUsuarioMaster() === true) {
        return true;
    }

    this.usuarioPermissao = [];
    this.usuarioPermissao = this.autenticacaoService.obterPermissaoUsuarioLogado();
    let retorno           = false;

    if (this.usuarioPermissao) {

        // Nome de cada Objeto Tela
        const listaPermissoes = permissoes;

        // Ações das telas
        const acoes = ['CADASTRAR', 'EDITAR', 'EXCLUIR', 'VISUALIZAR'];
        const is    = this;

        listaPermissoes.some(function (valuePermissao) {
            retorno = acoes.some(function (valueAcao) {
                return is.usuarioPermissao.find(item => item.pemissao === valuePermissao + valueAcao

                // Rota específica
                || valuePermissao === 'CLIENTEPARCELAS'
                || valuePermissao === 'CLIENTELISTACOBRANCA'
                || valuePermissao === 'CLIENTETRANSFERENCIA'
                || valuePermissao === 'SIMULACAOEMPRESTIMO'
                || valuePermissao === 'INTEGRACAOSMS'
                ) !== undefined;
            });
        });
    }
    return retorno;
  }

  possuiPermissao(permissao: string) {
    if (this.autenticacaoService.isUsuarioMaster() === true) {
        return true;
    }

    this.usuarioPermissao = [];
    this.usuarioPermissao = this.autenticacaoService.obterPermissaoUsuarioLogado();

    if (this.usuarioPermissao) {
        if (this.usuarioPermissao.find(item => item.pemissao === permissao) !== undefined) {
            return true;
        }
    }
    return false;
  }

   /*
  async obterUsuarioLogado() {
    this.usuarioDTO = await this.autenticacaoService.obterUsuarioLogado().toPromise();
  }
  */
}
