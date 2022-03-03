import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { RolesService } from '../../services/roles.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    roles: string[];
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'fa fa-pie-chart', roles: ['student', 'controller', 'administrator', 'institution'] },
    { path: 'profile', title: 'Meu perfil', icon: 'fa fa-user-circle-o', roles: ['student', 'controller', 'institution'] },
    { path: 'events', title: 'Eventos', icon: 'fa fa-comments', roles: ['student', 'controller', 'institution'] },
    { path: 'student/input-activity', title: 'Entrada de Atividade', icon: 'fa fa-paperclip', roles: ['student'] },
    { path: 'admin/institutions', title: 'Instituições', icon: 'fa fa-university nav-icon', roles: ['administrator'] },
    { path: 'admin/courses', title: 'Cursos', icon: 'fa fa-graduation-cap nav-icon', roles: ['administrator'] },
    { path: 'institution/courses', title: 'Cursos', icon: 'fa fa-graduation-cap nav-icon', roles: ['institution'] },
    { path: 'institution/controllers', title: 'Controladores', icon: 'fa fa-users nav-icon', roles: ['institution'] },
    { path: 'controller/activity-types', title: 'Tipos de Atividade', icon: 'fa fa-pencil nav-icon', roles: ['controller'] },
    { path: 'controller/rules', title: 'Regras', icon: 'fa fa-exclamation-triangle nav-icon', roles: ['controller'] }
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

    sidebarClose() {
        document.body.classList.remove('nav-open');
        document.getElementById('toggle-button').classList.remove('toggled');
    }

    logOut() {
        this.sidebarClose();
        this._auth.logOut();
    }
}
