import { Component, Input } from '@angular/core';

@Component({
  selector: 'aka-form-debug',
  templateUrl: './form-debug.component.html',
})
export class FormDebugComponent {
  @Input() form;
}
