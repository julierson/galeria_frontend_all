import {Component, ViewChild, EventEmitter, Output} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-popup-alerta',
  templateUrl: 'popup-alerta.component.html',
  styleUrls: ['./popup-alerta.component.css'],
})
export class PopPupAlertaComponent {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('smallModalRelEmprestimo') public smallModalRelEmprestimo: ModalDirective;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('successModalAviso') public successModalAviso: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('dangerModalAviso') public dangerModalAviso: ModalDirective;
  @ViewChild('dangerModalAlertaGrafico') public dangerModalAlertaGrafico: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;
  @ViewChild('smallModalFoto') public smallModalFoto: ModalDirective;
  @ViewChild('dangerModalAvisoAlerta') public dangerModalAvisoAlerta: ModalDirective;

  tituloModal: string;
  conteudoModal: string;
  respostaModal: string;
  urlFoto: any = 'assets/img/cliente/default.png';
  mode: any;

  @Output() retorno = new EventEmitter();

  // Pop-Up Foto
  showFoto(tituloModal: string, urlFoto: any) {
    this.tituloModal   = tituloModal;
    this.urlFoto = urlFoto;
    this.smallModalFoto.show();
  }

  // Pop-Up Relatórios
  showRelatorio(tituloModal: string, conteudoModal: string) {
    this.tituloModal   = tituloModal;
    this.conteudoModal = conteudoModal;
    this.smallModalRelEmprestimo.show();
  }

  voltarRelatorio(acao) {
      this.smallModalRelEmprestimo.hide();
      this.retorno.emit(acao);
  }

  // Pop-Up Alerta
  showAlerta(mode: string, tituloModal: string, conteudoModal: string) {
    this.mode          = mode;
    this.tituloModal   = tituloModal;
    this.conteudoModal = conteudoModal;

    if (mode === 'SUCESSO') {
      this.successModal.show();
    }

    if (mode === 'AVISO') {
      this.successModalAviso.show();
    }

    if (mode === 'ATENCAO') {
      this.warningModal.show();
    }

    if (mode === 'ALERTA') {
      this.dangerModal.show();
    }

    if (mode === 'ALERTA-AVISO') {
      this.dangerModalAviso.show();
    }

    if (mode === 'ALERTA-GLAFICO') {
      this.dangerModalAlertaGrafico.show();
    }

    if (mode === 'AVISO-ALERTA') {
      this.dangerModalAvisoAlerta.show();
    }

    if (mode === 'ERRO-CADASTRO') {
      this.dangerModal.show();
    }
  }

  voltar() {
    if (this.mode === 'SUCESSO') {
      this.successModal.hide();
      this.retorno.emit('');
    }

    if (this.mode === 'AVISO') {
      this.successModalAviso.hide();
      this.retorno.emit('');
    }

    if (this.mode === 'ATENCAO') {
      this.warningModal.hide();
      this.retorno.emit('');
    }

    if (this.mode === 'ALERTA') {
      this.dangerModal.hide();
      this.retorno.emit('SIM');
    }

    if (this.mode === 'AVISO-ALERTA') {
      this.dangerModalAvisoAlerta.hide();
      this.retorno.emit('SIM');
    }

    if (this.mode === 'ALERTA-GLAFICO') {
      this.dangerModalAlertaGrafico.hide();
      this.retorno.emit('SIM');
    }
  }
}
