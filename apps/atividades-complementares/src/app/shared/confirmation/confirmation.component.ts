import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'aka-confirmation',
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent {
  @Input() labelApprove = 'Sim';
  @Input() labelDeny = 'Não';
  @Input() key: string;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAccept = new EventEmitter();

  constructor(public _messageService: MessageService) {}

  toAccept() {
    this.onAccept.next();
  }
}
