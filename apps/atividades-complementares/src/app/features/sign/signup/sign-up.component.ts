import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from './../../../models/course.interface';
import { User } from './../../../models/user.interface';
import { AuthService } from './../../../services/auth.service';
import { CourseService } from './../../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'aka-sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
  courses$: Observable<Course[]>;
  loading = false;

  constructor(
    public _auth: AuthService,
    private _coursesService: CourseService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.courses$ = this._coursesService.get();
  }

  onSubmit({ value, valid }: { value: User; valid: boolean }) {
    if (valid) {
      this.loading = true;
      const dataUser: User = {
        uid: null,
        email: value.email,
        displayName: value.displayName,
        photoURL: null,
        status: 'A',
        roles: { student: true },
        createdAt: new Date(),
        course: value.course,
      };
      this._auth
        .createUserWithEmailAndPassword(dataUser, value.password)
        .then(() => {
          this._router.navigate(['/dashboard']);
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    }
  }
}
