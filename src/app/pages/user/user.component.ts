import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'app/models/user.interface';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { NotifyService } from '../../services/notify.service';
import { InstitutionService } from 'app/services/institution.service';
import { Institution } from 'app/models/institution.interface';
import { ValidatorService } from './../../services/validator.service';
import { CourseService } from './../../services/course.service';
import { CepService } from './../../services/cep.service';

@Component({
  selector: 'aka-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user$: Observable<User>;
  form: FormGroup;
  instituitions$: Observable<Institution[]>;
  courses$: any;
  disabledSave;

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _notify: NotifyService,
    private _institutionService: InstitutionService,
    private _courseService: CourseService,
    private _validatorService: ValidatorService,
    private _cepService: CepService
  ) {
    this.user$ = this._auth.user$;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.form.patchValue(user);
    });
    this.buildForm();
  }

  onSubmit() {
    if (this.form.valid) {
      // before submit assigns only the course uid in the user
      if (this.form.get('course').value) {
        this.form.patchValue({ course: this.form.get('course').value.uid });
      }
      this._userService.updateUser(this.form.get('uid').value, this.form.value)
        .then(_ => {
          this._notify.update('success', 'Perfil atualizado!');
        });
    } else {
      this._validatorService.markAllFieldsAsDirty(this.form);
      this.disabledSave = true;
    }
  }

  cepMask(cep) {
    cep = cep.replace(/\D/g, ''); // digitar apenas números
    cep = cep.replace(/^(\d{2})(\d)/, '$1.$2'); // após dois valores colocar o ponto (.)
    cep = cep.replace(/\.(\d{3})(\d)/, '.$1-$2'); // após três valores colocar o hífen (-)
    this.form.patchValue({ address: { zipCode: cep } });
  }

  getCourses(instituition: Institution) {
    this.form.patchValue({ instituition: instituition.uid });
    this._courseService.getCoursesInstitution(instituition.uid)
      .subscribe(res => {
        this.courses$ = res;
      });
  }

  searchCep() {
    this.clearAddressForm();
    const cep = this.form.get('address.zipCode').value;
    if (cep) {
      this._cepService.consultaCEP(cep).subscribe(dados => {
        if (dados.erro) {
          this._notify.update('warning', 'CEP não encontrado.');
        } else {
          this.setAddressForm(dados);
          this.instituitions$ = this._institutionService.getInstitutionByUF(dados.uf);
        }
      }, error => {
        this._notify.update('danger', `Houve um erro na requisição! ==> ${error}`);
      });
    } else {
      this._notify.update('warning', 'CEP inválido.');
    }
  }

  setAddressForm(data) {
    this.form.patchValue({
      address: {
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        country: 'Brasil'
      }
    })
  };

  clearAddressForm() {
    this.form.patchValue({
      address: {
        street: null,
        complement: null,
        neighborhood: null,
        city: null,
        state: null,
        country: null
      }
    })
  };

  buildForm() {
    this.form = this._fb.group({
      uid: [null],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      registration: [''],
      roles: this._fb.group({
        student: [null],
        controller: [null],
        administrator: [null]
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
        country: [null]
      }),
      instituition: [null],
      course: [null],
      about: ['']
    });
  }

}
