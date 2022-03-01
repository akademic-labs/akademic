import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'aka-confirmation',
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent implements OnInit {
  @Input() labelApprove = 'Sim';
  @Input() labelDeny = 'Não';
  @Input() key: string;
  @Output() onAccept: EventEmitter<any> = new EventEmitter();

  constructor(public _messageService: MessageService) {}

  ngOnInit() {}

  toAccept() {
    this.onAccept.next();
  }
}
