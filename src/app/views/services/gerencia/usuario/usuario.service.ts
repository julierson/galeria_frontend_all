import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { UsuarioDTO } from './usuariodto';
import { HttpClient } from '@angular/common/http';
import { AutenticacaoService } from '../../../components/Seguranca/autenticacao.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

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
    this.baseUrl = environment.baseUrl + '/usuario'; 
  }

  getUsuarioLogin(usuarioname: String): Observable<UsuarioDTO> {

    return this.http
                .get(this.baseUrl + '/dados/' + usuarioname + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  consultar(usuarioname: String): Observable<Usuario[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    if (usuarioname === undefined || usuarioname === '') {
      usuarioname = '';
      return this. consultarTodos();
    }

    return this.http
                .get(this.baseUrl + '/nome/' + idEmpresa  +  ',' + usuarioname  + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  consultarTodos(): Observable<Usuario[]> {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    return this.http
                .get(this.baseUrl + '/' + idEmpresa + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  listaUsuario(idEmpresa: number): Observable<Usuario[]>{
    return this.http
                .get(this.baseUrl + '/' + idEmpresa + '?access_token=' + JSON.parse(this.autenticacao.getToken()).access_token)
                .map((res: Response) => res.json());
  }

  setAvatar(id: number, file: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http
                .post(this.baseUrl + '/setavatar/' + id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                formdata).toPromise()
                .then((relatorio) => relatorio);
  }
  
  getAvatar(username: string) {
    const idEmpresa = this.autenticacao.getIdEmpresa();
    return this.http
            .get(this.baseUrl + '/getavatar/' + idEmpresa + ',' + username + '?access_token='
            + JSON.parse(this.autenticacao.getToken()).access_token, { responseType: ResponseContentType.Blob}).toPromise()
            .then((relatorio) => relatorio);
  }

  create(dado: Usuario): Observable<(Usuario)> {
    return this.http
                .post(this.baseUrl + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  update(dado: Usuario): Observable<(Usuario)> {
    return this.http
                .put(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                JSON.stringify(dado), this.options)
                .map((res: Response) => res.json());
  }

  delete(dado: Usuario): Observable<(Usuario)> {
    return this.http
                .delete(this.baseUrl + '/' + dado.id + '?access_token='
                + JSON.parse(this.autenticacao.getToken()).access_token,
                this.options)
                .map((res: Response) => res.json());
  }
}
