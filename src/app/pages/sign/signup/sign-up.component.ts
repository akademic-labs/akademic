import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { User } from 'app/models/user.interface';

@Component({
  selector: 'aka-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, public _auth: AuthService) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit({ value, valid }: { value, valid: boolean }) {
    if (valid) {
      const dataUser: User = {
        uid: null,
        email: value.email,
        displayName: value.displayName,
        photoURL: null,
        status: 'A',
        roles: value.roles,
        createdAt: new Date()
      };
      this._auth.createUser(dataUser, value.password);
    }
  }

  buildForm() {
    this.signUpForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      displayName: ['', Validators.required],
      password: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(25),
        Validators.required
      ]],
      confirmPassword: ['', Validators.required],
      roles: this.fb.group({
        student: [true]
      })
    }, {
        validator: this.matchPassword // validation method for password
      }
    );
  }

  private matchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ matchPassword: true })
    } else {
      return null
    }
  }
}
