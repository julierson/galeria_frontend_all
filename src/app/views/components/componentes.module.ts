// Angular
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule} from 'ngx-mask';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbPaginationModule, NgbAlertModule, NgbModule, } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { CommonModule, registerLocaleData } from '@angular/common';
import localept from '@angular/common/locales/pt';
registerLocaleData(localept);

// https://www.npmjs.com/package/ngx-device-detector
import { DeviceDetectorModule } from 'ngx-device-detector';

// https://www.npmjs.com/package/ng-block-ui
import {BlockUIModule } from 'ng-block-ui';

// https://www.npmjs.com/package/ng2-pdf-viewer
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Controla tempo Sessão logado
import { BnNgIdleService } from 'bn-ng-idle';

// Import Material
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatMenuModule} from '@angular/material/menu';

// Forms Component
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';

// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Ng2-select
import { SelectModule } from 'ng-select';

// Flexbox
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgbPaginationModule,
    AlertModule,
    NgbAlertModule,
    NgbModule,
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    Ng2Charts,
    DeviceDetectorModule,
    PdfViewerModule,

    // Forms Component
    FormsModule,
    ReactiveFormsModule,

    // Importe Material
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ClipboardModule,
    MatMenuModule,

    // Tabs Component
    TabsModule,

    // Carousel Component
    CarouselModule.forRoot(),

    // Collapse Component
    CollapseModule.forRoot(),

    // Dropdowns Component
    BsDropdownModule.forRoot(),

    // Pagination Component
    PaginationModule.forRoot(),

    // Popover Component
    PopoverModule.forRoot(),

    // Progress Component
    ProgressbarModule.forRoot(),

    // Tooltip Component
    TooltipModule.forRoot(),

    SelectModule,

    FlexLayoutModule,

  ],

  declarations: [

  ],

  providers: [
    BnNgIdleService
  ],

  exports: [
   
  ]
})

export class ComponenteModule {}
