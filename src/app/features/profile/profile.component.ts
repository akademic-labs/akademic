import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Course } from '../../models/course.interface';
import { Dropdown } from 'primeng/dropdown';
import { Observable } from 'rxjs';

import { Institution } from '../../models/institution.interface';
import { User } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { CepService } from '../../services/cep.service';
import { InstitutionService } from '../../services/institution.service';
import { NotifyService } from '../../services/notify.service';
import { UserService } from '../../services/user.service';
import { ValidatorService } from '../../services/validator.service';
import { maskCEP } from './../../utils/masks';

@Component({
  selector: 'aka-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;
  form: FormGroup;
  institutions$: Observable<Institution[]>;
  courses$: Observable<Course[]>;
  disabledSave;
  today = new Date().toJSON().split('T')[0];
  @ViewChild('dropdownCourses') dropdownCourses: Dropdown;

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _notify: NotifyService,
    private _institutionService: InstitutionService,
    private _validatorService: ValidatorService,
    private _cepService: CepService
  ) {
    this.user$ = this._auth.user$;
  }

  ngOnInit() {
    this.buildForm();
    this.user$.subscribe((user) => {
      // verify if user is institution and if it already has a user updated
      if (user.roles.institution && !user.registration) {
        this._institutionService
          .getInstitutionById(user.institution)
          .subscribe((institution) => {
            this.setInstitutionToUser(institution);
          });
      } else {
        this.form.patchValue(user);
        this.getInstitutions();
      }
    });
  }

  buildForm() {
    this.form = this._fb.group({
      uid: [null],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      registration: [''],
      roles: this._fb.group({
        student: [null],
        controller: [null],
        administrator: [null],
        institution: [null],
      }),
      birthday: [null],
      address: this._fb.group({
        zipCode: [null],
        street: [null],
        complement: [null],
        number: [null],
        neighborhood: [null],
        city: [null],
        state: [null],
        country: [null],
      }),
      institution: [null],
      course: new FormControl({ value: null, disabled: true }),
      about: [''],
    });
  }

  onSubmit() {
    if (this.form.get('roles').value.student) {
      // before submit assigns only set uid institution and course in the student
      const course = this.form.get('course').value;
      course instanceof Object
        ? this.form.get('course').setValue(course.uid)
        : this.form.get('course').setErrors({ invalid: true });
      const institution = this.form.get('institution').value;
      institution instanceof Object
        ? this.form.get('institution').setValue(institution.uid)
        : this.form.get('institution').setErrors({ invalid: true });
    }

    if (this.form.valid) {
      this._userService
        .update(this.form.get('uid').value, this.form.value)
        .then((_) => {
          this._notify.update('success', 'Perfil atualizado!');
        });
    } else {
      this._validatorService.markAllFieldsAsDirty(this.form);
      this.disabledSave = true;
    }
  }

  cepMask(cep) {
    this.form.get('address.zipCode').setValue(maskCEP(cep));
  }

  getInstitutions(event?) {
    const institution = this.form.get('institution').value;
    const uf = this.form.get('address.state').value;
    const course = this.form.get('course').value;
    if (institution && uf) {
      this.getCourses(institution, course);
      if (event) {
        this.institutions$ = this._institutionService.getInstitutionByName(
          uf,
          event.query
        );
      } else {
        typeof institution === 'string'
          ? this._institutionService
              .getInstitutionById(institution)
              .subscribe((res) => {
                this.form.get('institution').setValue(res);
                this.courses$ = this._institutionService.getInstitutionCourses(
                  this.form.get('institution').value.uid
                );
              })
          : this.form.get('institution').setValue(institution);
      }
      this.form.get('course').enable();
      // setTimeout(() => { this.dropdownCourses.focus() }, 100);
    } else {
      this.institutions$ = null;
      this.courses$ = null;
      this.form.get('course').setValue(null);
      this.form.get('course').disable();
      this.form.get('course').setErrors(null);
    }
  }

  getCourses(institution?, course?) {
    if (this.form.get('institution').value) {
      this.courses$ = this._institutionService.getInstitutionCourses(
        this.form.get('institution').value.uid
      );
      const courseValid = this.form.get('course').value;
      if (typeof courseValid === 'string') {
        this._institutionService
          .getCoursesInstitutionByUid(
            this.form.get('institution').value,
            courseValid
          )
          .valueChanges()
          .subscribe((res) => {
            this.form.get('course').setValue(res);
            this.courses$ = this._institutionService.getInstitutionCourses(
              this.form.get('institution').value.uid
            );
          });
      }
    }
  }

  queryCEP() {
    this.clearAddressForm();
    const cep = this.form.get('address.zipCode').value;
    if (cep) {
      this._cepService.queryCEP(cep).subscribe(
        (data) => {
          if (data.erro) {
            this._notify.update('warning', 'CEP não encontrado.');
          } else {
            this.setAddressForm(data);
          }
        },
        (error) => {
          this._notify.update(
            'danger',
            `Houve um erro na requisição! ==> ${error}`
          );
        }
      );
    } else {
      this._notify.update('warning', 'CEP inválido.');
    }
    // this.institutions$ ? this.form.get('institution').enable() : this.form.get('institution').disable();
  }

  setInstitutionToUser(data: Institution) {
    this.form.patchValue({
      displayName: data.instituicao,
      registration: data.cnpj,
      address: {
        street: data.endereco,
        city: data.municipio,
        state: data.uf,
      },
    });
  }

  setAddressForm(data) {
    this.form.patchValue({
      address: {
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        country: 'Brasil',
      },
    });
  }

  clearAddressForm() {
    this.form.patchValue({
      address: {
        street: null,
        complement: null,
        neighborhood: null,
        city: null,
        state: null,
        country: null,
      },
    });
  }

  validatorDate(input, date) {
    date > this.today
      ? this.form.get(input).setErrors({ dateGreaterToday: true })
      : this.form.get(input).setErrors(null);
  }
}
