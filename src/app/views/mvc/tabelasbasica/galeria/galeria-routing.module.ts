import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Sincronismo em geral
import { PropComponent } from './prop/prop.component';

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
        redirectTo: 'galeria'
      },

       // -------------------------------------------------------------------------------
       {
        path: 'prop',
        canActivate: [AuthGuard],
        component: PropComponent,
        data: {
          title: 'Log De Sistema', url: 'galeria/prop', permissao: 'SINCRONISMOSISTEMA'
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaleriaRoutingModule {}