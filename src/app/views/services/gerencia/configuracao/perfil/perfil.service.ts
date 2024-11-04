import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Perfil } from './perfil';
import { AutenticacaoService } from '../../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/perfil';
  }

  consultar(nome: String): Observable<Perfil[]> {
    const idSisEmpresa = this.autenticacao.getIdSisEmpresa();

    if (nome === undefined) {nome = ''; }
    return this.http
                .get(this.baseUrl + '/' + nome  +  ',' + idSisEmpresa  + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  create(dado: Perfil): Observable<(Perfil)> {
    return this.http
                .post(this.baseUrl + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  update(dado: Perfil): Observable<(Perfil)> {
    return this.http
                .put(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  delete(dado: Perfil): Observable<(Perfil)> {
    return this.http
                .delete(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                this.options)
                .map((res: Response) => res.json());
  }
}
