import {Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CamposObr } from './camposObr';

@Component({
  selector: 'app-popup-send-whaltsapp',
  templateUrl: 'popup-send-whaltsapp.component.html',
  styleUrls: ['./popup-send-whaltsapp.component.css'],
})

export class PopUpSendWhaltSappComponent implements OnInit {

  @ViewChild('modalSendWhaltSapp') public modalSendWhaltSapp: ModalDirective;
  tituloModal: string;
  habilitaBtn: boolean = true;

  varTelefoneMovel: String;
  varMensagem: String;
  classVarTelefoneMovel = {};
  campoobrigatorio = CamposObr;

  constructor(
  ) {}

  ngOnInit(): void {
    this.classVarTelefoneMovel = { 'form-control is-invalid': true};
    this.campoobrigatorio.find(item => item.campo === 'varTelefoneMovel').erro = false;
  }

  // Pop-Up Google Map
  show(telefoneMovel, mensagem) {
    this.tituloModal = 'Enviar Mensagem';

    this.varTelefoneMovel = telefoneMovel;
    this.varMensagem      = '';

    this.varMensagem = mensagem;
    this.modalSendWhaltSapp.show();
  }

  enviar() {
    if (!this.validaCampo()) {
      const telefone = this.formataTelefone(this.varTelefoneMovel);
      window.open('https://api.whatsapp.com/send/?phone=55' + telefone + '&text=' + this.varMensagem + '', '_blank');
    }
  }

  formataTelefone(value: String) {
    return value.replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace('-', '');  
  }

  fechar() {
    this.modalSendWhaltSapp.hide();
  }

  getTelefonejMask(campo: String): string {
    return this.isTelefone(campo) ? '(00) 0 0000 - 0000' : '';
  }

  isTelefone(campo: String): boolean {
    if ( campo === 'varTelefoneMovel') {
      return this.varTelefoneMovel == null ? true : this.varTelefoneMovel.length < 12 ? true : false;
    }
  }

  // Validação ao sair do campo
  isValidaCampo(campo: String) {
    if (campo === 'varTelefoneMovel' || campo === '') {
      campo = 'varTelefoneMovel';
      if (this.varTelefoneMovel === '' || this.varTelefoneMovel === null  || this.varTelefoneMovel === undefined) {
        this.campoobrigatorio.find(item => item.campo === campo).erro = true;
        this.classVarTelefoneMovel = { 'form-control is-invalid': true};
      } else {
        this.campoobrigatorio.find(item => item.campo === campo).erro = false;
        this.classVarTelefoneMovel = { 'form-control': true};
      }
      campo = '';
    }
  }

  validaCampo() {
    this.isValidaCampo('');
    if (this.varTelefoneMovel === '' || this.varTelefoneMovel === null  || this.varTelefoneMovel === undefined
    ) {
      return true;
    }
  }
}