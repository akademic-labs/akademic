import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { ActivityType } from '../../../models/activity-type.interface';
import { ActivityTypeService } from '../../../services/activity-type.service';

@Component({
  selector: 'aka-activity-type',
  templateUrl: './activity-type.component.html',
  styleUrls: ['./activity-type.component.css'],
})
export class ActivityTypeComponent implements OnInit {
  title = 'Tipos de Atividade';
  button = 'Adicionar';
  activityTypeForm: FormGroup;
  activityType: ActivityType;
  activityTypes$: Observable<ActivityType[]>;
  @ViewChild('inputFocus') focusIn: ElementRef;
  disabledSave: boolean;

  constructor(
    private _activityTypeFormBuilder: FormBuilder,
    private _activityTypeService: ActivityTypeService
  ) {}

  ngOnInit() {
    this.activityTypes$ = this._activityTypeService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
  }

  buildForm() {
    this.activityTypeForm = this._activityTypeFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      description: [null, Validators.required],
    });
  }

  save() {
    // if (this.activityTypeForm.valid) {
    if (!this.activityTypeForm.get('uid').value) {
      this._activityTypeService.post(this.activityTypeForm.value);
    } else {
      this._activityTypeService.put(
        this.activityType.uid,
        this.activityTypeForm.value
      );
    }
    this.activityTypeForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }
  // else {
  //   this.validatorService.checkOut(this.activityForm);
  //   this.disabledSave = true;
  //   this._notify.update('danger', 'Campos obrigatórios não preenchidos!');
  // }
  // }

  edit(obj) {
    this.activityTypeForm.patchValue({
      uid: obj.uid,
      description: obj.description,
    });
    this.activityType = obj;
    this.button = 'Atualizar';
    this.focusIn.nativeElement.focus();
  }

  remove(uid) {
    this._activityTypeService.delete(uid);
    this.activityTypeForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }
}
