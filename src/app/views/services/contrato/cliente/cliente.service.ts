import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Cliente } from './cliente';
import { AutenticacaoService } from '../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/cliente';
  }

  consultar(id: number, codigo: number, cpf: String, nome: String, listaNegra: boolean): Observable<Cliente[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    
    if (id === undefined || id === null) {id = 0; }
    if (codigo === undefined || codigo === null) {codigo = 0; }
    if (nome === undefined || nome === '') {nome = ' '; }
    if (cpf === undefined || cpf === null) {cpf = ' '; } else {/*cpf = cpf.replace(/[^\d]+/g, '');*/ }

    return this.http
                .get(this.baseUrl + '/' + id + ',' + codigo + ',' + cpf + ',' + nome + ',' + idEmpresa + ',' + listaNegra + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  getClienteId(id: number, listaNegra: Boolean): Observable<Cliente[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    return this.http
                .get(this.baseUrl + '/getclienteid/' + id + ',' + listaNegra + ',' + idEmpresa + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  listaClienteGeral(cpf: String, nome: String): Observable<Cliente[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    if (nome === undefined || nome === '') {nome = ' '; }
    if (cpf === undefined || cpf === null) {cpf = ' '; } else {/*cpf = cpf.replace(/[^\d]+/g, '');*/ }

    return this.http
                .get(this.baseUrl + '/listaclientegeral/' + cpf + ',' + nome + ',' + idEmpresa + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }


  listaAniversariantes(): Observable<Cliente[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    return this.http
                .get(this.baseUrl + '/aniversariantes/'  + idEmpresa + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  create(dado: Cliente): Observable<(Cliente)> {

    return this.http
                .post(this.baseUrl + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());

  }

  update(dado: Cliente): Observable<(Cliente)> {
    return this.http
                .put(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  delete(dado: Cliente): Observable<(Cliente)> {
    return this.http
                .delete(this.baseUrl + '/' + dado.id + ',' + dado.excluidoPor + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                this.options)
                .map((res: Response) => res.json());
  }

  transferencia(clienteId: number, empresaIdOld: number, empresaId: number): Observable<(number)> {
    return this.http
      .get(this.baseUrl + '/transf/' + clienteId + ',' + empresaIdOld + ',' + empresaId  + '?access_token='
      + JSON.parse(this.autenticacao.getToken()).access_token)
      .map((res: Response) => res.json());
  }

  geracodigocliente(): Observable<number> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    const param = idEmpresa;
    return this.http
                .get(this.baseUrl + '/geracodigocliente/' + param + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }
}
