import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'aka-confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {
  @Input() labelApprove = 'Sim';
  @Input() labelDeny = 'Não';
  @Input() key: string;

  onAccept = new EventEmitter();
  onDeny = new EventEmitter();

  constructor(private _messageService: MessageService) { }

  ngOnInit() {
  }

  toDeny() {
    this.toClear();
    this.onDeny.next();
  }

  toClear() {
    this._messageService.clear(this.key);
  }

  toAccept() {
    this.onAccept.next();
  }

}
