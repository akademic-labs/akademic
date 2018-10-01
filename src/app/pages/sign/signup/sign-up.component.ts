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

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    if (valid) {
      this._auth.createUser(value);
    }
  }

  isStudent() {
    this.signUpForm.patchValue({
      roles: {
        student: true,
        controller: false
      }
    });
  }

  isController() {
    this.signUpForm.patchValue({
      roles: {
        student: false,
        controller: true
      }
    });
  }

  buildForm() {
    this.signUpForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(25),
        Validators.required
      ]],
      confirmPassword: ['', Validators.required],
      roles: this.fb.group({
        student: [null, Validators.required],
        controller: [null, Validators.required]
      })
    }, {
      validator: this.matchPassword // validation method for password
    });
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
