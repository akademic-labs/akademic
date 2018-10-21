import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';

import { ActivityService } from 'app/services/activity.service';
import { ActivityTypeService } from 'app/services/activity-type.service';
import { ValidatorService } from './../../../services/validator.service';
import { UtilsService } from '../../../services/utils.service';

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
export class InputActivityComponent implements OnInit, OnDestroy {
  @ViewChild('inputFocus') focusIn: ElementRef;
  @ViewChild(UploadPageComponent) fileUpload: UploadPageComponent;

  activity: Activity;
  activityForm: FormGroup;
  activityTypes$: Observable<ActivityType[]>;
  states: States[];
  cities$: Observable<Cities[]>;
  disabledSave: boolean;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  subscribe: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _activityService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _validatorService: ValidatorService,
    private _storage: AngularFireStorage,
    private _utilsService: UtilsService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();

    this.activityTypes$ = this._actTypesService.get();

    this._utilsService.getStates()
      .subscribe(res => {
        this.states = this._utilsService.sortBy(res, 'nome', 'asc');
      });

    this.subscribe = this._route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this._activityService.getActivityById(params.get('id'))
          .subscribe(activity => {
            this.activityForm.patchValue(activity);
          })
      }
    });
  }

  getCities() {
    const state = this.activityForm.get('state').value;
    this._utilsService.getCities(state.id)
      .subscribe(res => {
        this.cities$ = this._utilsService.sortBy(res, 'nome', 'asc');
      });
  }

  buildForm() {
    this.activityForm = this._formBuilder.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      createdAt: [new Date()],
      description: ['', Validators.required],
      hoursDuration: ['', Validators.required],
      local: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      schoolYear: ['', Validators.required],
      semester: ['', Validators.required],
      observation: [''],
      activityType: ['', Validators.required],
      attach: [''],
      status: ['Pendente']
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this._activityService.createActivity(this.activityForm.value, this.fileUpload.attachs)
        .then(() => {
          // upload attachs
          for (let i = 0; i < this.fileUpload.uploads.length; i++) {
            // main task
            this.task = this._storage.upload(this.fileUpload.uploads[i].path, this.fileUpload.uploads[i].file, this.fileUpload.uploads[i].metadata);
            // progress monitoring
            this.percentage = this.task.percentageChanges();
          }
          this.buildForm();
        });
    } else {
      this._validatorService.markAllFieldsAsDirty(this.activityForm);
      this.disabledSave = true;
    }
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
