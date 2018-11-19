import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Institution } from '../../models/institution.interface';
import { User } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { CepService } from '../../services/cep.service';
import { InstitutionService } from '../../services/institution.service';
import { NotifyService } from '../../services/notify.service';
import { UserService } from '../../services/user.service';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'aka-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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
    private _validatorService: ValidatorService,
    private _cepService: CepService
  ) {
    this.user$ = this._auth.user$;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      // verify if user is institution and if it already has a user updated
      if (user.roles.institution && !user.registration) {
        this._institutionService.getInstitutionById(user.institution)
          .subscribe(institution => {
            this.setInstitutionToUser(institution);
          })
      } else {
        this.form.patchValue(user);
      }
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
    this._institutionService.getInstitutionCourses(instituition.uid)
      .subscribe(res => {
        this.courses$ = res;
      });
  }

  searchCep() {
    this.clearAddressForm();
    const cep = this.form.get('address.zipCode').value;
    if (cep) {
      this._cepService.queryCEP(cep).subscribe(dados => {
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

  setInstitutionToUser(data: Institution) {
    this.form.patchValue({
      displayName: data.instituicao,
      registration: data.cnpj,
      address: {
        street: data.endereco,
        city: data.municipio,
        state: data.uf
      }
    })
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
        administrator: [null],
        institution: [null]
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
      institution: [null],
      course: [null],
      about: ['']
    });
  }

}
