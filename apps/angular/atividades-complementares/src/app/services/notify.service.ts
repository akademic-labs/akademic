import { Injectable } from '@angular/core';

declare let $: any;

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  update(type: 'danger' | 'info' | 'success' | 'warning', message: string) {
    $.notify(
      { icon: 'fa fa-bell-o', message: message },
      {
        type: type,
        timer: 100,
        allow_dismiss: false,
        placement: {
          from: 'top',
          align: 'right',
        },
        auto_hide: true,
      }
    );
  }
}
