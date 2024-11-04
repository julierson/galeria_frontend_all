// Angular
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';

import localept from '@angular/common/locales/pt';
registerLocaleData(localept);

/*Import's comum entre os modules-------------------------------------------------------------------*/
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/*Componentes do projeto ---------------------------------------------------------------------------*/
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { PopUpAlertaModule } from './../components/popup-alerta/popup-alerta.module';
import { PipeModule } from './../components/pipe/pipe.module';
import { GraficoComponent } from './grafico/grafico.component';
import { HomeslideComponent } from './homeslide/homeslide.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,

    //Import's comum entre os modules
    ChartsModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    

    //Componentes do projeto
    DashboardRoutingModule,
    PopUpAlertaModule,
    PipeModule
   
  ],
  declarations: [ DashboardComponent, GraficoComponent, HomeslideComponent ]
})
export class DashboardModule { }
