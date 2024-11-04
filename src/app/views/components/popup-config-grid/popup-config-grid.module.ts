// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

/*Import's comum entre os modules-------------------------------------------------------------------*/
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SelectModule } from 'ng-select';

// Componente
import { PopUpConfigGridComponent } from './popup-config-grid.component';
//import { ConfigGridService } from './configgrid.service';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AlertModule,
    NgbAlertModule,
    ModalModule.forRoot(),
    SelectModule
  ],

  declarations: [
    PopUpConfigGridComponent,
   // ConfigGridService
  ],

  providers: [],
  exports: [
    PopUpConfigGridComponent,
    //ConfigGridService
  ]
})

export class PopUpConfigGridModule {}
