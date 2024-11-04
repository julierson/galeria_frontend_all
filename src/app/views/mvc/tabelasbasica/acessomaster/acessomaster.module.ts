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
import { PipeModule } from './../../../components/pipe/pipe.module';
import { PopUpAlertaModule } from './../../../components/popup-alerta/popup-alerta.module';

//Routing
import { AcessoMasterRoutingModule } from './acessomaster-routing.module';

// Sincronismo em geral
import { SincronismoComponent } from './sincronismo/sincronismo.component';
import { SincDadosComponent } from './sincronismo/sinc-dados/sinc-dados';
import { CacheDadosComponent } from './sincronismo/cache-dados/cache-dados';

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
    AcessoMasterRoutingModule,
  ],
  declarations: [

    // Sincronismo em geral
    SincronismoComponent,
    SincDadosComponent,
    CacheDadosComponent,
  ]
})

export class AcessoMasterModule {}
