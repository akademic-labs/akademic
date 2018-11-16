import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Course } from './../../../models/course.interface';
import { User } from './../../../models/user.interface';
import { AuthService } from './../../../services/auth.service';
import { CourseService } from './../../../services/course.service';
import { InstitutionService } from './../../../services/institution.service';

@Component({
  selector: 'aka-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  @Input() hasAccountLink = true;

  courses$: Observable<Course[]>;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, public _auth: AuthService,
    private _institutionService: InstitutionService, private _coursesService: CourseService) { }

  ngOnInit() {
    this.buildForm();

    this.courses$ = this._auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this._institutionService.getInstitutionCourses(user.institution);
        } else {
          return this._coursesService.get();
        }
      }));
  }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    if (valid) {
      const dataUser: User = {
        uid: null,
        email: value.email,
        displayName: value.displayName,
        photoURL: null,
        status: 'A',
        roles: value.roles,
        createdAt: new Date(),
        course: value.course
      };
      this._auth.createUserWithEmailAndPassword(dataUser, value.password);
    }
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
      roles: this.fb.group({
        student: [true]
      }),
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
