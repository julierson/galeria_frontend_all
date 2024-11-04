import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

import { LoginComponent } from './views/login/login.component';

import { ErrorloginComponent } from './views/errorlogin/errorlogin.component';
import { AcessoNegadoComponent } from './views/acessonegado/acessonegado.component';
import { ListaEmpresaComponent } from './views/listaempresa/listaempresa.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'listaempresa',
    component: ListaEmpresaComponent,
    data: {
      title: 'Empresas'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    
    children: [
      {
        path: 'home',
        loadChildren: () => import('./views/home/dashboard.module').then(m => m.DashboardModule)
      },

      {
        path: 'acessomaster',
        loadChildren: () => import('./views/mvc/tabelasbasica/acessomaster/acessomaster.module').then(m => m.AcessoMasterModule)
      },

      {
        path: 'galeria',
        loadChildren: () => import('./views/mvc/tabelasbasica/galeria/galeria.module').then(m => m.GaleriaModule)
      },

      {
        path: 'minhaconta',
        loadChildren: () => import('./views/mvc/minhaconta/minhaconta.module').then(m => m.MinhaContaModule)
      },
    ]
  },

  // url erro login
  {
    path: 'errorlogin',
    component: ErrorloginComponent,
    data: {
      title: 'Erro Login'
    }
  },

  {
    path: 'acessonegado',
    component: AcessoNegadoComponent,
    data: {
      title: 'Acesso Negado'
    }
  },

  { path: '**', component: P404Component }
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
