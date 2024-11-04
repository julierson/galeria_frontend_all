import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Meus Dados
import { MeusDadosComponent } from './meusdados/meusdados/meusdados.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'minhaconta'
    },
    children: [
      {
        path: '',
        redirectTo: 'minhaconta'
      },

      // -------------------------------------------------------------------------------
      {
        path: 'meusdados',
        component: MeusDadosComponent,
        data: {
          title: 'Meus Dados'
        }
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinhaContaRoutingModule {}
