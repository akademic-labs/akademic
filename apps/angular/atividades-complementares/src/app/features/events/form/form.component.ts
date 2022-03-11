import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { EventService } from '../../../services/events.service';
import { Cities } from './../../../models/cities.interface';
import { Post } from './../../../models/post.interface';
import { States } from './../../../models/states.interface';
import { AuthService } from './../../../services/auth.service';
import { NotifyService } from './../../../services/notify.service';
import { UtilsService } from './../../../services/utils.service';
import { ValidatorService } from './../../../services/validator.service';

@Component({
  selector: 'aka-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  form: FormGroup;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;
  @ViewChild('inputTitle') inputTitle: ElementRef;
  @ViewChild('inputCity') inputCity: AutoComplete;
  today = new Date().toJSON().split('T')[0];
  disabledSave: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _eventService: EventService,
    private _auth: AuthService,
    private _notify: NotifyService,
    private _utilsService: UtilsService,
    private _validatorService: ValidatorService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.states$ = this._utilsService.getStates();

    this.form = this._formBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      title: ['', Validators.required],
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      description: ['', Validators.required],
      local: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', Validators.required],
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: [0],
    });
    setTimeout(() => {
      this.inputTitle.nativeElement.focus();
    }, 100);
  }

  formControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  async onSubmit({ value, valid }: { value: Post; valid: boolean }) {
    if (valid) {
      const user = await this._auth.user$.pipe(take(1)).toPromise();
      value.owner = user.uid;
      this._eventService.create(value).then(() => {
        this.buildForm();
        this._notify.update('success', 'Evento adicionado com sucesso!');
      });
    } else {
      this._validatorService.markAllFieldsAsDirty(this.form);
      this.disabledSave = true;
    }
  }

  getCities(event?) {
    const state = this.form.get('state').value;
    if (state) {
      this.form.get('city').enable();
      setTimeout(() => {
        this.inputCity.inputEL.nativeElement.focus();
      }, 100);
      if (event) {
        this.cities$ = this._utilsService.getCities(state.id, event.query);
      }
    } else {
      this.cities$ = null;
      this.form.get('city').setValue('');
      this.form.get('city').disable();
      this.form.get('city').setErrors(null);
    }
  }

  validatorDate(input, event: Event) {
    const date = (event.target as HTMLInputElement).value;

    if (date < this.today) {
      this.form.get(input).setErrors({ dateSmallerToday: true });
    }
    if (input === 'initialDate' && this.form.get('finalDate').value) {
      if (date > this.form.get('finalDate').value) {
        this.form.get(input).setErrors({ dateGreaterFinal: true });
      }
    }
    if (input === 'finalDate') {
      if (date < this.form.get('initialDate').value) {
        this.form.get(input).setErrors({ dateGreaterInitial: true });
      }
    }
  }
}
