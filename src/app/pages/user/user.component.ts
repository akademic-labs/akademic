import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'app/models/user.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'aka-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user$: Observable<User>;
  form: FormGroup;

  constructor(private _auth: AuthService, private fb: FormBuilder, private _userService: UserService,
    private _notify: NotifyService) {
    this.user$ = this._auth.user$;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.form.patchValue(user);
    })
    this.buildForm();
  }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
    if (valid) {
      this._userService.updateUser(value.uid, value)
        .then(_ => {
          this._notify.update('success', 'Perfil atualizado!');
        });
    }
  }

  cepMask(cep) {
    cep = cep.replace(/\D/g, ''); // digitar apenas números
    cep = cep.replace(/^(\d{2})(\d)/, '$1.$2'); // após dois valores colocar o ponto (.)
    cep = cep.replace(/\.(\d{3})(\d)/, '.$1-$2'); // após três valores colocar o hífen (-)
    this.form.patchValue({ address: { zipCode: cep } });
  }

  buildForm() {
    this.form = this.fb.group({
      uid: [null],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      registration: [''],
      roles: this.fb.group({
        student: [null],
        controller: [null],
        administrator: [null]
      }),
      birthday: [null],
      address: this.fb.group({
        street: [null],
        number: [null],
        zipCode: [null],
        city: [null],
        state: [null],
        country: [null]
      }),
      about: ['']
    });
  }

}
