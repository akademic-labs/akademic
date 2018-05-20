import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from 'app/services/notify.service';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  userForm: FormGroup;
  formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  validationMessages = {
    'email': {
      'required': 'E-mail é obrigatório.',
      'email': 'E-mail deve conter um e-mail válido',
    },
    'password': {
      'required': 'Senha é obrigatória.',
      'pattern': 'Senha deve incluir uma letra e um número.',
      'minlength': 'Senha deve conter ao menos 8 caracteres.',
      'maxlength': 'Senha não pode ser maior que 25 caracteres.',
    },
  };

  constructor(private fb: FormBuilder, private _auth: AuthService) { }

  ngOnInit() {
    this.buildForm();
  }

  login() {
    this.loading = true;
    this._auth.emailLogin(this.userForm.value['email'], this.userForm.value['password'])
      .then((ignore) => this.loading = false);
  }

  resetPassword() {
    if (this.userForm.get('email').valid) {
      this._auth.resetPassword(this.userForm.value['email']);
    } else {
      const message = 'Digite um e-mail válido para resetar';
      this.formErrors['email'] += `${message}`;
    }
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(25)
      ]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
