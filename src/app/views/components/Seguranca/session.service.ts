import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionService {

  constructor() {}

  // Get Set Dados -------------------------------------------------------------------

  setDadoGrafico(dado: any) {
    localStorage.setItem('dadoGrafico', dado.toString());
  }

  getDadoGrafico() {
    return localStorage.getItem('dadoGrafico');
  }

  removeDadoGrafico() {
    return localStorage.removeItem('dadoGrafico');
  }
  
}
