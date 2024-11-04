// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule} from 'ngx-mask';

// Componente
import { PopUpSendWhaltSappComponent } from './popup-send-whaltsapp.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AlertModule,
    NgbAlertModule,
    ModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ],

  declarations: [
    PopUpSendWhaltSappComponent
  ],

  providers: [],
  exports: [
    PopUpSendWhaltSappComponent
  ]
})

export class PopUpSendWhaltSappModule {}
