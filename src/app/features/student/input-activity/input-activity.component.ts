import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadsPageComponent } from 'app/shared/uploads-page/uplodas-page/uploads-page.component';
import { AutoComplete } from 'primeng/autocomplete';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { FormCanDeactivate } from '../../../guards/deactivate.interface';
import { UtilsService } from '../../../services/utils.service';
import { ActivityType } from './../../../models/activity-type.interface';
import { Activity } from './../../../models/activity.interface';
import { Cities } from './../../../models/cities.interface';
import { States } from './../../../models/states.interface';
import { ActivityTypeService } from './../../../services/activity-type.service';
import { ActivityService } from './../../../services/activity.service';
import { AuthService } from './../../../services/auth.service';
import { ErrorService } from './../../../services/error.service';
import { NotifyService } from './../../../services/notify.service';
import { ValidatorService } from './../../../services/validator.service';


@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit, OnDestroy, FormCanDeactivate {

  @ViewChild(UploadsPageComponent) uploadPage: UploadsPageComponent;
  @ViewChild('inputDescription') inputDescription: ElementRef;
  @ViewChild('inputCity') inputCity: AutoComplete;
  activityForm: FormGroup;
  activityTypes$: Observable<ActivityType[]>;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;
  disabledSave: boolean;
  subscribe: Subscription;
  years = ['2018', '2017', '2016', '2015'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  labelButton = 'Salvar';
  loading: boolean;
  activity: Activity;
  today = new Date().toJSON().split('T')[0];

  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.checkForm()) {
      $event.returnValue = true;
    }
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _activityService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _validatorService: ValidatorService,
    private _utilsService: UtilsService,
    private _errorService: ErrorService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _notifyService: NotifyService,
    private _auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.buildForm();
    this.activityTypes$ = this._actTypesService.get();
    this.states$ = this._utilsService.getStates();
    this.subscribe = this._route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this._activityService.getActivityById(params.get('id'))
          .subscribe(activity => {
            this.activity = activity;
            setTimeout(() => { this.inputDescription.nativeElement.focus() }, 100);
            this.labelButton = 'Atualizar';
            this.activityForm.patchValue(activity);
            this.getCities();
            activity.status === 'Pendente' ? this.activityForm.enable() : this.activityForm.disable();
            // disable buttons upload and delete attach (variable ref uploads)
            // activity.status === 'Pendente' ? this.uploadPage.uploadState = '' : this.uploadPage.uploadState = 'running';
            this.loading = false;
          },
            error => {
              this._errorService.handleErrorByCode(error.code);
              this.loading = false;
            }
          );
      } else {
        this.loading = false;
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
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      observation: ['', Validators.maxLength(500)],
      status: ['Pendente'],
      feedback: new FormControl({ value: null, disabled: true })
    });
  }

  getCities(event?) {
    const state = this.activityForm.get('state').value;
    if (state) {
      this.activityForm.get('city').enable();
      setTimeout(() => { this.inputCity.inputEL.nativeElement.focus(); }, 100);
      if (state && event) {
        this.cities$ = this._utilsService.getCities(state.id, event.query);
      }
    } else {
      this.cities$ = null;
      this.activityForm.get('city').setValue('');
      this.activityForm.get('city').disable();
      this.activityForm.get('city').setErrors(null);
    }
  }

  async save({ value, valid }: { value: Activity, valid: boolean }) {
    this.activityForm.get('city').value instanceof Object ? this.activityForm.get('city').setErrors(null) : this.activityForm.get('city').setErrors({ invalid: true });
    if (valid) {
      const user = await this._auth.user$.pipe(take(1)).toPromise();
      value.user = user.uid;

      if (value.uid) {
        this._activityService.update(value, value.uid, this.uploadPage.attachments)
          .then(() => {
            this._notifyService.update('success', 'Atividade atualizada com sucesso!');
            this.resetForm();
          });
      } else {
        this._activityService.create(value, this.uploadPage.attachments)
          .then(() => {
            this._notifyService.update('success', 'Atividade cadastrada com sucesso!');
            this.resetForm();
          });
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
    this._router.navigate(['/student/input-activity']);
  }

  compareActivityType(activityType: ActivityType, activityType2: ActivityType) {
    return activityType && activityType2 ? activityType.uid === activityType2.uid : activityType === activityType2;
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  canDeactivate() {
    // if (value) {
    //   this._messageService.clear();
    //   return true;
    // } else
    if (this.activityForm.dirty && this.activityForm.invalid && !this.disabledSave) {
      this._messageService.add({
        key: 'deactivate', sticky: true, severity: 'warn', summary: 'Tem certeza?',
        detail: `Houve alterações no formulário, deseja realmente descartá-lo e mudar de tela'?`
      });
      // this._router.navigate(['/student/input-activity']);
      return false;
    } else {
      this._messageService.clear();
      return true;
    }
  }

  checkForm() {
    if (this.activityForm.dirty && this.activityForm.invalid && !this.disabledSave) {
      // this._router.navigate(['/student/input-activity']);
      // return false;
      // this.canDeactivate2(false)
      return false;
    } else {
      // this.canDeactivate2(true)
      return true;
    }
    // else {
    // this._messageService.clear();
    // return true;
    // }
  }

  canDeactivateDialog() {
    if (this.checkForm() === false) {
      this._messageService.add({
        key: 'deactivate', sticky: true, severity: 'warn', summary: 'Tem certeza?',
        detail: `Houve alterações no formulário, deseja realmente descartá-lo e mudar de tela'?`
      });
      // return false;
    }
    if (this.checkForm() === true) {
      // this.canDeactivateFinal(true);
      return true;
    }
    // if (value) {
    // return this.checkForm();
    // }
    // return true;
    // if (value) {
    // this._messageService.clear();
    // return value;
    // } else if (this.activityForm.dirty && this.activityForm.invalid && !this.disabledSave) {
    //   this._messageService.add({
    //     key: 'deactivate', sticky: true, severity: 'warn', summary: 'Tem certeza?',
    //     detail: `Houve alterações no formulário, deseja realmente descartá-lo e mudar de tela'?`
    //   });
    //   // this._router.navigate(['/student/input-activity']);
    //   return false;
    // } else {
    //   this._messageService.clear();
    //   return true;
    // }
    // return true;
  }

  canDeactivateFinal(choice?: boolean) {
    if (choice) {
      return this.navigateAwaySelection$.next(true);
    } else {
      // return this.canDeactivateDialog();
      return this.navigateAwaySelection$.next(false);
    }
    // return value;
  }

  validatorDate(input, date) {
    if (date > this.today) {
      this.activityForm.get(input).setErrors({ dateGreaterToday: true });
    }
    if (input === 'initialDate' && this.activityForm.get('finalDate').value) {
      if (date > this.activityForm.get('finalDate').value) {
        this.activityForm.get(input).setErrors({ dateGreaterFinal: true });
      }
    }
    if (input === 'finalDate') {
      if (date < this.activityForm.get('initialDate').value) {
        this.activityForm.get(input).setErrors({ dateGreaterInitial: true });
      }
    }
  }

}
