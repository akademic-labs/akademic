import { NotifyService } from './notify.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(
    private _notify: NotifyService
  ) {}

  checkOut(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup) {
        this.checkOut(controle);
      }
    });
    this._notify.update('danger', 'Campos obrigatórios não preenchidos!');
  }
}
