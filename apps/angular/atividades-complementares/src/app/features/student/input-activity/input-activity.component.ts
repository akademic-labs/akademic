import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadsPageComponent } from '../../../shared/uploads-page/uplodas-page/uploads-page.component';
import { AutoComplete } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { UtilsService } from '../../../services/utils.service';
import { CanDeactivateInterface } from './../../../guards/can-deactivate.guard';
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
  styleUrls: ['./input-activity.component.css'],
})
export class InputActivityComponent
  implements OnInit, OnDestroy, CanDeactivateInterface
{
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

  wasChanged: Subject<boolean> = new Subject<boolean>();
  withoutChanged: boolean;

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
  ) {}

  ngOnInit() {
    this.loading = true;
    this.buildForm();
    this.activityTypes$ = this._actTypesService.get();
    this.states$ = this._utilsService.getStates();
    this.subscribe = this._route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this._activityService.getActivityById(params.get('id')).subscribe(
          (activity) => {
            this.activity = activity;
            setTimeout(() => {
              this.inputDescription.nativeElement.focus();
            }, 100);
            this.labelButton = 'Atualizar';
            this.activityForm.patchValue(activity);
            activity.status === 'Pendente'
              ? this.activityForm.enable()
              : this.activityForm.disable();
            // disable buttons upload and delete attach (variable ref uploads)
            // activity.status === 'Pendente' ? this.uploadPage.uploadState = '' : this.uploadPage.uploadState = 'running';
            this.loading = false;
          },
          (error) => {
            this._errorService.handleErrorByCode(error.code);
            this.loading = false;
          }
        );
      } else {
        this.loading = false;
      }
    });
  }

  reload() {
    window.location.reload();
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
      feedback: new FormControl({ value: null, disabled: true }),
    });
  }

  get description() {
    return this.activityForm.get('description') as FormControl;
  }

  get activityType() {
    return this.activityForm.get('activityType') as FormControl;
  }

  get hoursDuration() {
    return this.activityForm.get('hoursDuration') as FormControl;
  }

  get schoolYear() {
    return this.activityForm.get('schoolYear') as FormControl;
  }

  get semester() {
    return this.activityForm.get('semester') as FormControl;
  }

  get initialDate() {
    return this.activityForm.get('initialDate') as FormControl;
  }

  get finalDate() {
    return this.activityForm.get('finalDate') as FormControl;
  }

  get local() {
    return this.activityForm.get('local') as FormControl;
  }

  get state() {
    return this.activityForm.get('state') as FormControl;
  }

  get city() {
    return this.activityForm.get('city') as FormControl;
  }

  get observation() {
    return this.activityForm.get('observation') as FormControl;
  }

  getCities(event?) {
    const state = this.activityForm.get('state').value;
    if (state) {
      this.activityForm.get('city').enable();
      setTimeout(() => {
        this.inputCity.inputEL.nativeElement.focus();
      }, 100);
      if (event) {
        this.cities$ = this._utilsService.getCities(state.id, event.query);
      }
    } else {
      this.cities$ = null;
      this.activityForm.get('city').setValue('');
      this.activityForm.get('city').disable();
      this.activityForm.get('city').setErrors(null);
    }
  }

  async save({ value, valid }: { value: Activity; valid: boolean }) {
    this.activityForm.get('city').value instanceof Object
      ? this.activityForm.get('city').setErrors(null)
      : this.activityForm.get('city').setErrors({ invalid: true });
    if (valid) {
      const user = await this._auth.user$.pipe(take(1)).toPromise();
      value.user = user.uid;

      if (value.uid) {
        this._activityService
          .update(value, value.uid, this.uploadPage.attachments)
          .then(() => {
            this._notifyService.update(
              'success',
              'Atividade atualizada com sucesso!'
            );
            this.resetForm();
          });
      } else {
        this._activityService
          .create(value, this.uploadPage.attachments)
          .then(() => {
            this._notifyService.update(
              'success',
              'Atividade cadastrada com sucesso!'
            );
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
    this._router.navigate(['/dashboard']);
  }

  compareActivityType(activityType: ActivityType, activityType2: ActivityType) {
    return activityType && activityType2
      ? activityType.uid === activityType2.uid
      : activityType === activityType2;
  }

  validatorDate(input, dateEvent: Event) {
    const date = (dateEvent.target as HTMLInputElement).value;

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

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  check() {
    this.activityForm.dirty
      ? this._messageService.add({
          key: 'deactivate',
          sticky: true,
          detail: `Houve alterações no formulário. Deseja realmente descartar e mudar de página?`,
        })
      : (this.withoutChanged = true);
  }

  choose(choice: boolean) {
    this.wasChanged.next(choice);
    this._messageService.clear('deactivate');
  }
}
