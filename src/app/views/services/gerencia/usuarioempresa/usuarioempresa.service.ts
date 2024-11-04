import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { UsuarioEmpresa } from './usuarioempresa';
import { HttpClient } from '@angular/common/http';
import { AutenticacaoService } from '../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEmpresaService {

  private headers: Headers;
  private options: RequestOptions;
  private baseUrl: string;

  constructor(
    private http: Http,
    private autenticacao: AutenticacaoService,
    private httpClient: HttpClient
    ) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({ headers : this.headers });
    this.baseUrl = environment.baseUrl + '/usuarioempresa'; 
  }

  listaUsuarioEmpresaAll(usuarioId: number): Observable<UsuarioEmpresa[]>{
    return this.http
                .get(this.baseUrl + '/' + usuarioId + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  listaUsuarioEmpresa(usuarioId: number, empresaId: number): Observable<UsuarioEmpresa[]>{
    return this.http
                .get(this.baseUrl + '/' + usuarioId + ',' + empresaId + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  listaUsuarioPorEmpresa(empresaId: number): Observable<UsuarioEmpresa[]>{
    return this.http
                .get(this.baseUrl + '/empresa/' + empresaId + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  create(dado: UsuarioEmpresa): Observable<(UsuarioEmpresa)> {
    return this.http
                .post(this.baseUrl + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  delete(dado: UsuarioEmpresa): Observable<(UsuarioEmpresa)> {
    return this.http
                .delete(this.baseUrl + '/' + dado.usuarioEmpresaId.usuario.id + ',' + dado.usuarioEmpresaId.empresa.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                this.options)
                .map((res: Response) => res.json());
  }
}
