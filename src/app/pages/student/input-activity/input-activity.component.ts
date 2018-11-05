import { Activity } from './../../../models/activity.interface';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable, Subscription } from 'rxjs';

import { UtilsService } from '../../../services/utils.service';
import { UploadPageComponent } from '../../../uploads/upload-page/upload-page.component';
import { ActivityType } from './../../../models/activity-type.interface';
import { Cities } from './../../../models/cities.interface';
import { States } from './../../../models/states.interface';
import { ActivityTypeService } from './../../../services/activity-type.service';
import { ActivityService } from './../../../services/activity.service';
import { ValidatorService } from './../../../services/validator.service';

@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit, OnDestroy {

  @ViewChild(UploadPageComponent) fileUpload: UploadPageComponent;
  activityForm: FormGroup;
  activityTypes$: Observable<ActivityType[]>;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;
  disabledSave: boolean;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  subscribe: Subscription;
  years = ['2018', '2017', '2016', '2015'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  activity: Activity;
  attachments = [];
  loading = true;
  attachView;

  constructor(
    private _formBuilder: FormBuilder,
    private _activityService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _validatorService: ValidatorService,
    private _storage: AngularFireStorage,
    private _utilsService: UtilsService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
    this.activityTypes$ = this._actTypesService.get();
    this.states$ = this._utilsService.getStates();
    this.subscribe = this._route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this._activityService.getActivityById(params.get('id'))
          .subscribe(activity => {
            this.activityForm.patchValue(activity);
            if (activity.attachments.length) {
              activity.attachments.forEach(element => {
                this._storage.ref(element.url).getDownloadURL()
                  .subscribe(res => {
                    this.attachments.push({ name: element.name, type: element.type, url: res })
                    this.loading = false;
                  });
              });
            }
          })
      }
    });
  }

  buildForm() {
    this.activityForm = this._formBuilder.group({
      uid: [''],
      createdAt: [''],
      description: ['', Validators.required],
      activityType: ['', Validators.required],
      hoursDuration: ['', Validators.required],
      schoolYear: ['', Validators.required],
      semester: ['', Validators.required],
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      local: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      observation: [''],
      status: ['Pendente']
    });
  }

  getCities() {
    this.cities$ = this._utilsService.getCities(this.activityForm.get('state').value.id);
  }

  onSubmit() {
    if (this.activityForm.valid) {
      if (this.activityForm.get('uid').value) {
        this._activityService.updateActivity(this.activityForm.value, this.fileUpload.attachments)
          .then(() => {
            // upload attachments
            for (let i = 0; i < this.fileUpload.uploads.length; i++) {
              // main task
              this.task = this._storage.upload(this.fileUpload.uploads[i].path, this.fileUpload.uploads[i].file, this.fileUpload.uploads[i].metadata);
              // progress monitoring
              this.percentage = this.task.percentageChanges();
            }
            // this._router.navigate(['/dashboard']);
          });
      } else {
        this.activityForm.removeControl('uid');
        this._activityService.createActivity(this.activityForm.value, this.fileUpload.attachments)
          .then(() => {
            // upload attachments
            for (let i = 0; i < this.fileUpload.uploads.length; i++) {
              // main task
              this.task = this._storage.upload(this.fileUpload.uploads[i].path, this.fileUpload.uploads[i].file, this.fileUpload.uploads[i].metadata);
              // progress monitoring
              this.percentage = this.task.percentageChanges();
            }
            // this._router.navigate(['/dashboard']);
          });
      }
    } else {
      this._validatorService.markAllFieldsAsDirty(this.activityForm);
      this.disabledSave = true;
    }
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  showAttach(attach) {
    this.attachView = attach;
    // document.getElementById('main').classList.add('filter-blur');
  }
}
