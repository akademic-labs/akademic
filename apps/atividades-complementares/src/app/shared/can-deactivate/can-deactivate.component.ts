import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

import { CanDeactivateInterface } from '../../guards/can-deactivate.guard';

@Component({
  selector: 'aka-can-deactivate',
  templateUrl: './can-deactivate.component.html',
})
export class CanDeactivateComponent implements CanDeactivateInterface {
  wasChanged: Subject<boolean> = new Subject<boolean>();
  withoutChanged: boolean;
  @Input() form: FormGroup;

  constructor(private _messageService: MessageService) {}

  check() {
    this.form.dirty
      ? this._messageService.add({
          key: 'deactivate',
          sticky: true,
          detail: `Houve alterações no formulário. Deseja realmente descartar e mudar de página?`,
        })
      : (this.withoutChanged = true);
    // this.chooseCanDeactivate(true);
  }

  choose(choice: boolean) {
    this.wasChanged.next(choice);
    this._messageService.clear('deactivate');
  }
}
