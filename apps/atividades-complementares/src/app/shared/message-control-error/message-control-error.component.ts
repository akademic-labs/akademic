import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aka-message-control-error',
  template: `
    <div
      *ngIf="
        (control.hasError(error) && control.dirty) ||
        (control.hasError(error) && control.touched)
      "
    >
      <div class="message-error">
        {{ msg }}
      </div>
    </div>
  `,
  styles: [
    `
      .message-error {
        color: var(--color-invalid);
        font-size: 12px;
        margin: -10px 0px 0px 0px;
        padding: 0px 0px 5px 0px;
      }
    `,
  ],
})
export class MessageControlErrorComponent {
  @Input() error: string;
  @Input() msg: string;
  @Input() control: FormControl;
}
