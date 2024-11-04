import { Component, OnInit } from '@angular/core';
import { INavBadge, INavAttributes, INavLabel, INavWrapper, INavLinkProps } from '@coreui/angular/lib/sidebar/app-sidebar-nav';
import { AutorizacaoService } from '../views/components/Seguranca/autorizacao.service';
interface  INavData {
  name?: string;
  url?: string | any[];
  href?: string;
  icon?: string;
  badge?: INavBadge;
  title?: boolean;
  children?: INavData[];
  variant?: string;
  attributes?: INavAttributes;
  divider?: boolean;
  class?: string;
  label?: INavLabel;
  wrapper?: INavWrapper;
  linkProps?: INavLinkProps;
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  acessEmpresa: boolean = true;
  public sidebarMinimized = false;
  public navItems: INavData[] = [{}];

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(
      private autorizacaoService: AutorizacaoService,
      ) {
  }

  ngOnInit(): void {

    // Para ocultar user class = 'd-none'
    this.navItems.push(
      {
        name: 'Acesso Master',
        url: '/controle-master',
        icon: 'fas fa-cog',
        class: this.autorizacaoService.menuPermissao(['LOGSISTEMA', 'COBRANCASISTEMA']),
        children: [
          {
            name: 'Sincronismo',
            url: '/acessomaster/sincronismo',
            icon: 'fas fa-sync',
            class: this.autorizacaoService.menuPermissao(['SINCRONISMOSISTEMA']),
          },
        ]
      },

      {
        name: 'Galerias',
        url: '/galeria',
        icon: 'fas fa-images',
        class: this.autorizacaoService.menuPermissao(['LOGSISTEMA', 'COBRANCASISTEMA']),
        children: [
          {
            name: 'Gerenciar',
            url: '/galeria/prop', 
            icon: 'fas fa-chalkboard',
            class: this.autorizacaoService.menuPermissao(['SINCRONISMOSISTEMA']),
          },
        ]
      },
    );
  }
}
