import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/services/auth.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: '' },
    { path: 'user', title: 'Perfil do Usuário', icon: 'pe-7s-user', class: '' },
    { path: 'input-activity', title: 'Entrada de Atividade', icon: 'pe-7s-bell', class: '' },
    { path: 'admin', title: 'Administrador', icon: 'pe-7s-config', class: '' }
];

@Component({
    selector: 'aka-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor(private _authService: AuthService) { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if (jQuery(window).width() > 991) {
            return false;
        }
        return true;
    };

    logOut() {
        this._authService.logOut();
    }
}
