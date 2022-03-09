import { User } from './../../../models/user.interface';
import { Component, OnInit } from '@angular/core';

import { Course } from '../../../models/course.interface';
import { CourseService } from '../../../services/course.service';
import { AuthService } from './../../../services/auth.service';
import { InstitutionService } from './../../../services/institution.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aka-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  sourceCourses: Course[];
  targetCourses: Course[];
  user: User;

  constructor(
    private _courseService: CourseService,
    private _institutionService: InstitutionService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this._courseService.get().subscribe((result) => {
      this.sourceCourses = result;
    });

    this._auth.user$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this._institutionService
        .getInstitutionCourses(user.institution)
        .subscribe((result) => {
          this.targetCourses = result;
        });
    });
  }

  onMoveToTarget(event) {
    const targetCourses: Course[] = event.items;

    targetCourses.forEach((course) => {
      this._institutionService.setCourse(this.user.institution, course);
    });
  }
}
