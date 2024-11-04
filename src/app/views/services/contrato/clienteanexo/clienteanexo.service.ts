import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { GRAnexo } from './clienteAnexo';
import { AutenticacaoService } from '../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteAnexoService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/clienteanexo';
  }

  getListaAll(): Observable<GRAnexo> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    return this.http
      .get(this.baseUrl + '/getListaAll/' + idEmpresa + '?access_token='
      + JSON.parse(this.autenticacao.getToken()).access_token)
      .map((res: Response) => res.json());
  }

  gerar(tipoGeracao: any, id: any): Observable<(any)> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    return this.http
      .get(this.baseUrl + '/gerar/' + idEmpresa + ',' + tipoGeracao + ',' + id +  '?access_token=' 
      + JSON.parse(this.autenticacao.getToken()).access_token)
      .map((res: Response) => res);
  }
 
  isVerificaProcessamento(id: any): Observable<String> {
    return this.http
      .get(this.baseUrl + '/isVerificaProcessamento/'  + id + '?access_token='
      + JSON.parse(this.autenticacao.getToken()).access_token)
      .map((res: Response) => res.text());
  }

  gerarBackup() {
    return this.http
      .get(this.baseUrl + '/gerarbackup' + '?access_token='
      + JSON.parse(this.autenticacao.getToken()).access_token, { responseType: ResponseContentType.Blob}).toPromise()
      .then((relatorio) => relatorio);
  }
}
