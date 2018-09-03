import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable({
  providedIn: 'root'
})
export class MessageServicePrimeNG {

  constructor(private _messageService: MessageService) { }

  messageGrowl(severity, summary, detail) {
    this._messageService.clear();
    this._messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  closeMessageGrowl() {
    this._messageService.clear();
  }

  messageConfirm(key, sticky, severity, summary, detail) {
    this._messageService.clear();
    this._messageService.add({ key: key, sticky: sticky, severity: severity, summary: summary, detail: detail });
  }

  closeMessageConfirm(key) {
    this._messageService.clear(key);
  }

}
