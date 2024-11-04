import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Administracao {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/administracao';
  }

  sincronizaDados(servico: String): Observable<String> {
    const idEmpresa = this.autenticacao.getIdEmpresa();

    return this.http
    .get(this.baseUrl + '/'  + idEmpresa + ',' + servico + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
    .map((res: Response) => res.text());
  }

  finalizaSincronizacao(): Observable<String> {
    const idEmpresa = this.autenticacao.getIdEmpresa();

    return this.http
    .get(this.baseUrl + '/finalizarSicronizacao/'  + idEmpresa + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
    .map((res: Response) => res.text());
  }

  isVerificaSicronizacao(id: number): Observable<String> {
    return this.http
    .get(this.baseUrl + '/isVerificaSicronizacao/'  + id + '?access_token='
    + JSON.parse(this.autenticacao.getToken()).access_token)
    .map((res: Response) => res.text());
  }
}
