import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { States } from 'app/models/states.interface';
import { Cities } from 'app/models/cities.interface';
import { Activity } from 'app/models/activity.interface';
import { ActivityType } from 'app/models/activity-type.interface';

import { ActivityService } from 'app/services/activity.service';
import { ActivityTypeService } from 'app/services/activity-type.service';

import { Observable } from 'rxjs';

import { UploadPageComponent } from 'app/uploads/upload-page/upload-page.component';

@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit {
  @ViewChild(UploadPageComponent) fileUpload: UploadPageComponent;

  activity: Activity;
  activityForm: FormGroup;
  activityTypes$: Observable<ActivityType[]>;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;

  constructor(private fb: FormBuilder, public _actService: ActivityService,
    private _actTypesService: ActivityTypeService, private _http: HttpClient) { }

  ngOnInit() {
    this.buildForm();
    this.activityTypes$ = this._actTypesService.getTypes();

    this.getStates();
  }

  getStates() {
    this.states$ = this._http.get<States[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  }

  getCities() {
    const state = this.activityForm.get('state').value;
    this.cities$ = this._http.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.id}/municipios`);
  }

  buildForm() {
    this.activityForm = this.fb.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      createdAt: [new Date().toISOString().split('T')[0]],
      description: ['', Validators.required],
      hoursDuration: ['', Validators.required],
      local: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      schoolYear: ['', Validators.required],
      semester: ['', Validators.required],
      observation: [''],
      activityType: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this._actService.createActivity(this.activityForm.value, this.fileUpload.attach)
        .then(result => {
          console.log(result);
          this.activityForm.reset();
          this.buildForm();
        });
    }
  }

}
