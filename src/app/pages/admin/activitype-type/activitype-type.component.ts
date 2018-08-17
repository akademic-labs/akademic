import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivityType } from '../../../models/activity-type.interface';
import { ActivityTypeService } from 'app/services/activity-type.service';

@Component({
  selector: 'aka-activitype-type',
  templateUrl: './activitype-type.component.html',
  styleUrls: ['./activitype-type.component.css']
})
export class ActivitypeTypeComponent implements OnInit {

  title = "Tipos de Atividade";
  button = "Adicionar";
  activityTypeForm: FormGroup;
  activityType: ActivityType;
  $activityTypes: Observable<ActivityType[]>;
  @ViewChild("inputFocus") focusIn: ElementRef;

  constructor(private _activityTypeFormBuilder: FormBuilder, private _activityTypeService: ActivityTypeService) {}

  ngOnInit() {
    this.$activityTypes = this._activityTypeService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
  }

  buildForm(){
    this.activityTypeForm = this._activityTypeFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      description: [null, Validators.required]
    });
  }

  save() {
    if (!this.activityTypeForm.get("uid").value) {
      this._activityTypeService.post(this.activityTypeForm.value);
    } else {
      this._activityTypeService.put(this.activityType.uid, this.activityTypeForm.value);
    }
    this.activityTypeForm.reset();
    this.button = "Adicionar";
    this.focusIn.nativeElement.focus();
  }

  edit(obj) {
    this.activityTypeForm.patchValue({ uid: obj.uid, description: obj.description });
    this.activityType = obj;
    this.button = "Atualizar";
    this.focusIn.nativeElement.focus();
  }

  remove(uid) {
    this._activityTypeService.delete(uid);
    this.activityTypeForm.reset();
    this.button = "Adicionar";
    this.focusIn.nativeElement.focus();
  }

}