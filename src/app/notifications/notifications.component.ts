import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    showNotification(from, align) {
        const type = ['', 'info', 'success', 'warning', 'danger'];

        const color = Math.floor((Math.random() * 4) + 1);
        $.notify({
            icon: 'pe-7s-gift',
            message: 'Bem-vindo ao <b>Akademic</b>.'
        }, {
                type: type[color],
                timer: 500,
                allow_dismiss: false,
                placement: {
                    from: from,
                    align: align
                }
            });
    }
}
