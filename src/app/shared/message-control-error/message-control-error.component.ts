import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aka-message-control-error',
  template: `
    <div *ngIf='checkOut()'>
      <div class='message-error'>
        {{ msg }}
      </div>
    </div>
  `,
  styles: [
    `
      .message-error {
        color: var(--color-invalid);
        font-size: 12px;
        margin: -10px 0px 0px 5px;
        padding: 0px 0px 5px 0px;
      }
    `
  ]
})
export class MessageControlErrorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  // tslint:disable-next-line:member-ordering
  @Input() error: string;
  // tslint:disable-next-line:member-ordering
  @Input() msg: string;
  // tslint:disable-next-line:member-ordering
  @Input() control: FormControl;

  checkOut(): boolean {
    return (
      (this.control.hasError(this.error) && this.control.dirty) ||
      (this.control.hasError(this.error) && this.control.touched)
    );
  }
}
