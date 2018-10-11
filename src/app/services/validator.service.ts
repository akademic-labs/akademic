import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(private _notify: NotifyService) {}

  markAllFieldsAsDirty(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsDirty();
      if (control instanceof FormGroup) {
        this.markAllFieldsAsDirty(control);
      }
    });
    this._notify.update('danger', 'Campos obrigatórios não preenchidos!');
  }
}
