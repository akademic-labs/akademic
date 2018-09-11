import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';

import { ActivityService } from 'app/services/activity.service';
import { ActivityTypeService } from 'app/services/activity-type.service';
import { CityStateService } from './../../../services/city-state.service';
import { ValidatorService } from './../../../services/validator.service';

import { Activity } from 'app/models/activity.interface';
import { ActivityType } from 'app/models/activity-type.interface';
import { States } from 'app/models/states.interface';
import { Cities } from 'app/models/cities.interface';
import { UploadPageComponent } from 'app/uploads/upload-page/upload-page.component';

@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit {

  title = 'Entrada de Atividade';
  activity: Activity;
  activityForm: FormGroup;
  activityTypes$: Observable<ActivityType[]>;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;
  disabledSave: boolean;
  @ViewChild('inputFocus') focusIn: ElementRef;
  @ViewChild(UploadPageComponent) fileUpload: UploadPageComponent;
  task: AngularFireUploadTask;
  percentage: Observable<number>;

  testes = [];
  testes2: any = [];
  massa = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _activityService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _validatorService: ValidatorService,
    private _storage: AngularFireStorage,
    private _cityStateService: CityStateService
  ) { }

  ngOnInit() {
    this.buildForm();
    setTimeout(() => { this.focusIn.nativeElement.focus(); }, 100);
    this.activityTypes$ = this._actTypesService.get();
    this.states$ = this._cityStateService.getStates();

    this._cityStateService.getStates()
      .subscribe(res => {
        this.testes = res
        // , console.log(res)
        this.massa = this.testes.sort();
        // this.massa = this.testes.sort((n1, n2) => {
        //   if (n1 > n2) {
        //     return 1;
        //   }

        //   if (n1 < n2) {
        //     return -1;
        //   }

        //   return 0;
        // });

      });
  }

  getCities() {
    const state = this.activityForm.get('state').value;
    this.cities$ = this._cityStateService.getCities(state.id);

    this._cityStateService.getCities(state.id)
      .subscribe(res => {
        this.testes2 = res
        // , console.log(res)
      });
  }

  buildForm() {
    this.activityForm = this._formBuilder.group({
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
      activityType: ['', Validators.required],
      attach: ['']
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this._activityService
        .createActivity(this.activityForm.value, this.fileUpload.attach, this.fileUpload.uploads)
        .then(result => {
          // console.log(result);
          // Upload Attachments
          for (let i = 0; i < this.fileUpload.uploads.length; i++) {
            // The main task
            // tslint:disable-next-line:max-line-length
            this.task = this._storage.upload(this.fileUpload.uploads[i].path, this.fileUpload.uploads[i].file, this.fileUpload.uploads[i].metadata);
            // Progress monitoring
            this.percentage = this.task.percentageChanges();
          }
          this.activityForm.reset();
          this.focusIn.nativeElement.focus();
        });
    } else {
      this._validatorService.checkOut(this.activityForm);
      this.disabledSave = true;
    }
  }
}
