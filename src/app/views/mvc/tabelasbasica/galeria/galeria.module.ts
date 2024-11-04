// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';

import localept from '@angular/common/locales/pt';
registerLocaleData(localept);

/*Import's comum entre os modules-------------------------------------------------------------------*/


import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatCheckboxModule} from '@angular/material/checkbox';
// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

/*Componentes do projeto ---------------------------------------------------------------------------*/
import { PipeModule } from '../../../components/pipe/pipe.module';
import { PopUpAlertaModule } from '../../../components/popup-alerta/popup-alerta.module';

//Routing
import { GaleriaRoutingModule } from './galeria-routing.module';

// Sincronismo em geral
import { PropComponent } from './prop/prop.component';
import { AnexoClienteComponent } from './prop/anexo-cliente/anexo-cliente';
import { FotoClienteComponent } from './prop/foto-cliente/foto-cliente';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,

    //Import's comum entre os modules
    NgbModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatCheckboxModule,
    ProgressbarModule.forRoot(),
    
    TooltipModule.forRoot(),
    NgbPaginationModule,

    //Componentes do projeto
    PipeModule,
    PopUpAlertaModule,
    GaleriaRoutingModule,
  ],
  declarations: [

    // Sincronismo em geral
    PropComponent,
    AnexoClienteComponent,
    FotoClienteComponent,
  ]
})

export class GaleriaModule {}
