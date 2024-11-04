import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { GraficoDTO } from './graficodto';
import { AutenticacaoService } from '../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService
    ) {
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.options = new RequestOptions({ headers : this.headers });
      this.baseUrl = environment.baseUrl + '/grafico';
  }

  getDadosGrafico(): Observable<GraficoDTO> {
    const idEmpresa = this.autenticacao.getIdEmpresa();

    return this.http
                .get(this.baseUrl + '/' + idEmpresa + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }
}
