import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReadyService {

  // Exculta o metodo quando chamado por outras telas
  dadosUsuario = new Subject();
  listaAniversariante = new Subject();

  constructor() {
    }

    // Objeto app-header
    readyDadosUsuario(ready: any) {
        this.dadosUsuario = ready;
    }

    atualizarDadosUsuario() {
        this.dadosUsuario.next('ready');
    }

    readyListaAniversariante(ready: any) {
        this.listaAniversariante = ready;
    }

    atualizarListaAniversariante() {
        this.listaAniversariante.next('ready');
    }
}
