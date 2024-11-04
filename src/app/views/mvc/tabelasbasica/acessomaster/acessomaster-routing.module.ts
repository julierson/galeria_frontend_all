import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Sincronismo em geral
import { SincronismoComponent } from './sincronismo/sincronismo.component';

import { AuthGuard } from '../../../../menu/auth.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Acesso Master'
    },
    children: [
      {
        path: '',
        redirectTo: 'acessomaster'
      },

       // -------------------------------------------------------------------------------
       {
        path: 'sincronismo',
        canActivate: [AuthGuard],
        component: SincronismoComponent,
        data: {
          title: 'Log De Sistema', url: 'acessomaster/sincronismo', permissao: 'SINCRONISMOSISTEMA'
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcessoMasterRoutingModule {}