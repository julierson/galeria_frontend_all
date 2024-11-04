import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { GacheDTO } from './cachedto';
import { AutenticacaoService } from '../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/cache';
  }

  listarCacheAll(): Observable<GacheDTO> {
    //const idEmpresa = this.autenticacao.getIdEmpresa();

    return this.http
                .get(this.baseUrl + '/listarCacheAll?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  limparCache(nome:string): Observable<string>{

    return this.http.get(this.baseUrl  + '/limparCache/' + nome + '?access_token='
    + JSON.parse(this.autenticacao.getToken()).access_token)
    .map((res: Response) => res.text());
  }

  limparCacheAll(){
    this.http.post(this.baseUrl + '/listarCacheAll?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token,this.options);
  }
}
