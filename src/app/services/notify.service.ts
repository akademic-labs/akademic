import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

declare let $: any;

/// Notify users about errors and other helpful stuff
export interface Msg {
  content: string;
  style: string;
}

@Injectable()
export class NotifyService {

  private _msgSource = new Subject<Msg | null>();

  msg = this._msgSource.asObservable();

  clear() {
    this._msgSource.next(null);
  }

  update(type: 'danger' | 'info' | 'success' | 'warning', message: string) {
    $.notify({
      icon: 'pe-7s-gift',
      message: message
    },
      {
        type: type,
        timer: 500,
        allow_dismiss: false,
        placement: {
          from: 'top',
          align: 'right'
        }
      });
      // const msg: Msg = { type, type };
      // this._msgSource.next(msg);
  }
}
