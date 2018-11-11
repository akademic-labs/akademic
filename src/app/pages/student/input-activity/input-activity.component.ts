import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { UtilsService } from '../../../services/utils.service';
import { UploadPageComponent } from '../../../uploads/upload-page/upload-page.component';
import { ActivityType } from './../../../models/activity-type.interface';
import { Cities } from './../../../models/cities.interface';
import { States } from './../../../models/states.interface';
import { ActivityTypeService } from './../../../services/activity-type.service';
import { ActivityService } from './../../../services/activity.service';
import { ErrorService } from './../../../services/error.service';
import { ValidatorService } from './../../../services/validator.service';

@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit, OnDestroy {

  @ViewChild(UploadPageComponent) uploadPage: UploadPageComponent;
  @ViewChild('inputFocus') focus: ElementRef;
  activityForm: FormGroup;
  activityTypes$: Observable<ActivityType[]>;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;
  disabledSave: boolean;
  subscribe: Subscription;
  years = ['2018', '2017', '2016', '2015'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  buttonSave = 'Salvar';

  constructor(
    private _formBuilder: FormBuilder,
    private _activityService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _validatorService: ValidatorService,
    private _utilsService: UtilsService,
    private _errorService: ErrorService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    // window.scrollTo(0, 0);
    this.buildForm();
    setTimeout(() => { this.focus.nativeElement.focus() }, 100);
    this.activityTypes$ = this._actTypesService.get();
    this.states$ = this._utilsService.getStates();
    this.subscribe = this._route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this._activityService.getActivityById(params.get('id'))
          .subscribe(
            activity => {
              this.buttonSave = 'Atualizar';
              this.activityForm.patchValue(activity);
            },
            error => {
              this._errorService.handleErrorByCode(error.code);
            }
          );
      }
    });
  }

  buildForm() {
    this.activityForm = this._formBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
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
    if (this.activityForm.get('state').value) {
      this.cities$ = this._utilsService.getCities(this.activityForm.get('state').value.id);
    } else {
      this.activityForm.get('city').setValue(null);
      this.cities$ = null;
    }
  }

  save() {
    if (this.activityForm.valid) {
      if (this.activityForm.get('uid').value) {
        this._activityService.updateActivity(this.activityForm.value, this.activityForm.get('uid').value, this.uploadPage.attachments);
        this.resetForm();
      } else {
        this._activityService.createActivity(this.activityForm.value, this.uploadPage.attachments);
        this.resetForm();
      }
    } else {
      this._validatorService.markAllFieldsAsDirty(this.activityForm);
      this.disabledSave = true;
    }
  }

  resetForm() {
    this.activityForm.reset();
    this.uploadPage.resetProgress();
    this.uploadPage.resetAttachments();
    this.ngOnDestroy();
    this._router.navigate(['/input-activity']);
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
