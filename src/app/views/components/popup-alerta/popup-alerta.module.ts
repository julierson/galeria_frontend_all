// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

/*Import's comum entre os modules-------------------------------------------------------------------*/
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

// Componente
import { PopPupAlertaComponent } from './popup-alerta.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AlertModule,
    NgbAlertModule,
    ModalModule.forRoot()
  ],

  declarations: [
    PopPupAlertaComponent
  ],

  providers: [],
  exports: [
    PopPupAlertaComponent
  ]
})

export class PopUpAlertaModule {}