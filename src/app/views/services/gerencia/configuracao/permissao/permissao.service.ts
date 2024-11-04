import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Permissao } from './permissao';
import { AutenticacaoService } from '../../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/permissao';
  }

  consultar(nome: String): Observable<Permissao[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    if (nome === undefined) {nome = ''; }

    return this.http
                .get(this.baseUrl + '/' + nome  +  ',' + idEmpresa  + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  create(dado: Permissao): Observable<(Permissao)> {
    return this.http
                .post(this.baseUrl + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  update(dado: Permissao): Observable<(Permissao)> {
    return this.http
                .put(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  delete(dado: Permissao): Observable<(Permissao)> {
    return this.http
                .delete(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                this.options)
                .map((res: Response) => res.json());
  }
}