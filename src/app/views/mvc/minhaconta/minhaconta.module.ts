// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

/*Import's comum entre os modules-------------------------------------------------------------------*/
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


/*Componentes do projeto ---------------------------------------------------------------------------*/
import { PopUpAlertaModule } from './../../components/popup-alerta/popup-alerta.module';

// Routing
import { MinhaContaRoutingModule } from './minhaconta-routing.module';
import { MeusDadosComponent } from './meusdados/meusdados/meusdados.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,

    //Import's comum entre os modules
    AlertModule,
    NgbModule,
    

    //Componentes do projeto
    MinhaContaRoutingModule,
    PopUpAlertaModule
  ],
  declarations: [
    MeusDadosComponent
  ]
})

export class MinhaContaModule {}
