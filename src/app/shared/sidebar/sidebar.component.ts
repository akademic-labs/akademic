import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/services/auth.service';
import { RolesService } from 'app/services/roles.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    roles: string[];
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'fa fa-pie-chart', roles: ['student', 'controller', 'administrator'] },
    { path: 'user', title: 'Meu perfil', icon: 'fa fa-user-circle-o', roles: ['student', 'controller'] },
    { path: 'input-activity', title: 'Entrada de Atividade', icon: 'fa fa-paperclip', roles: ['student', 'administrator'] },
    { path: 'institution', title: 'Instituições', icon: 'fa fa-university nav-icon', roles: ['administrator'] },
    { path: 'controller', title: 'Controladores', icon: 'fa fa-users nav-icon', roles: ['administrator'] },
    { path: 'course', title: 'Cursos', icon: 'fa fa-graduation-cap nav-icon', roles: ['controller', 'administrator'] },
    { path: 'acitivityType', title: 'Tipos de Atividade', icon: 'fa fa-pencil nav-icon', roles: ['controller', 'administrator'] },
    { path: 'rules', title: 'Regras', icon: 'fa fa-exclamation-triangle nav-icon', roles: ['controller', 'administrator'] }
];

@Component({
    selector: 'aka-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor(public _auth: AuthService, private _roles: RolesService) { }

    ngOnInit() {
        this._auth.user$.subscribe(user => {
            this.menuItems = ROUTES.filter(menuItem => this._roles.checkAuthorization(user, menuItem.roles));
        });
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    sidebarClose() {
        document.body.classList.remove('nav-open');
        document.getElementById('toggle-button').classList.remove('toggled');
    }

    logOut() {
        this.sidebarClose();
        this._auth.logOut();
    }
}
