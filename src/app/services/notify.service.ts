import { Injectable } from '@angular/core';

declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  update(type: 'danger' | 'info' | 'success' | 'warning', message: string) {
    $.notify({ icon: 'pe-7s-bell', message: message },
      {
        type: type,
        timer: 500,
        allow_dismiss: false,
        placement: {
          from: 'top',
          align: 'right'
        }
      }
    );
  }
}
