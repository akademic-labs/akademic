import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'aka-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  isReseting = false;
  formErrors: FormErrors = {
    email: '',
    password: '',
  };
  validationMessages = {
    email: {
      required: 'E-mail é obrigatório.',
      email: 'E-mail deve ser válido',
    },
    password: {
      required: 'Senha é obrigatória.',
      pattern: 'Senha deve incluir uma letra e um número.',
      minlength: 'Senha deve conter ao menos 8 caracteres.',
      maxlength: 'Senha não pode ser maior que 25 caracteres.',
    },
  };

  constructor(private _fb: FormBuilder, public _auth: AuthService) {}

  ngOnInit() {
    this.buildForm();
  }

  login() {
    if (this.userForm.valid) {
      this.loading = true;
      this._auth
        .signInWithEmailAndPassword(
          this.userForm.value['email'],
          this.userForm.value['password']
        )
        .then(() => (this.loading = false));
    }
  }

  signInWithGoogle() {
    this._auth.googleLogin();
  }

  signInWithFacebook() {
    this._auth.facebookLogin();
  }

  signInWithTwitter() {
    this._auth.twitterLogin();
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
    this.userForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(8),
          Validators.maxLength(25),
        ],
      ],
    });

    this.userForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged() {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (
        Object.prototype.hasOwnProperty.call(this.formErrors, field) &&
        (field === 'email' || field === 'password')
      ) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${
                  (messages as { [key: string]: string })[key]
                } `;
              }
            }
          }
        }
      }
    }
  }
}
