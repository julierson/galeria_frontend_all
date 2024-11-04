import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Data, Router} from '@angular/router';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { AutorizacaoService } from '../views/components/Seguranca/autorizacao.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private autorizacaoService: AutorizacaoService,

    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return from(this.validarRota(route.data));
  }

  private async validarRota(data: Data) {

    if (this.autorizacaoService.rotaPermissao([data.permissao])) {

      if (data.url === '' || data.url === null || data.url === undefined) {

      } else {
        window.location.href = environment.baseAplicacaoURL + '/#/' +  data.url;
      }
      return true;

    } else {
      
      this.router.navigate(['/acessonegado']);

      return false;
    }
  }
}
