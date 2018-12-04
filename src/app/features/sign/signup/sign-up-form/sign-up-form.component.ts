import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Course } from './../../../../models/course.interface';

@Component({
  selector: 'aka-sign-up-form',
  templateUrl: './sign-up-form.component.html'
})
export class SignUpFormComponent implements OnInit {

  @Input() hasAccountLink = true;
  @Input() courses$: Observable<Course[]>;
  @Input() loading = false;
  @Output() submitted: EventEmitter<FormGroup> = new EventEmitter();
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit(parentForm: FormGroup) {
    this.submitted.next(parentForm);
    this.signUpForm.reset();
  }

  buildForm() {
    this.signUpForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      displayName: ['', [
        Validators.required,
        Validators.pattern('[a-zA-ZÀ-ú ]*')
      ]],
      password: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8),
        Validators.maxLength(25),
        Validators.required
      ]],
      confirmPassword: ['', Validators.required],
      course: [null, Validators.required]
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
