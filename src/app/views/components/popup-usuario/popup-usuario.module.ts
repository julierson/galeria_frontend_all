// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

/*Import's comum entre os modules-------------------------------------------------------------------*/
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';


// Componente
import { PopUpUsuarioComponent } from './popup-usuario.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AlertModule,
    NgbAlertModule,
    ModalModule.forRoot(),
    HttpClientModule
  ],

  declarations: [
    PopUpUsuarioComponent
  ],

  providers: [],
  exports: [
    PopUpUsuarioComponent
  ]
})

export class PopUpUsuarioModule {}
