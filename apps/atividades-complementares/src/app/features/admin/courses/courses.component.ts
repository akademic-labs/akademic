import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

import { Course } from '../../../models/course.interface';
import { CourseService } from '../../../services/course.service';
import { Cols } from './../../../models/cols.interface';

@Component({
  selector: 'aka-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  @ViewChild('inputFocus') focus: ElementRef;
  courseForm: FormGroup;
  course: Course;
  courses$: Observable<Course[]>;
  buttonLabel = 'Adicionar';
  cols: Cols[];

  constructor(
    private _courseFormBuilder: FormBuilder,
    private _courseService: CourseService,
    public _messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'actions', header: 'Ações' },
    ];

    this.courses$ = this._courseService.get();
    this.buildForm();
    this.focus.nativeElement.focus();
  }

  buildForm() {
    this.courseForm = this._courseFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.required],
    });
  }

  save() {
    if (this.courseForm.get('uid').value) {
      this._courseService.put(this.course.uid, this.courseForm.value);
    } else {
      this._courseService.post(this.courseForm.value);
    }
    this.renderForm();
  }

  edit(obj) {
    this.course = obj;
    this.buttonLabel = 'Atualizar';
    this.focus.nativeElement.focus();
  }

  remove() {
    this._courseService.delete(this.course.uid);
    this.renderForm();
    this._messageService.clear();
  }

  renderForm() {
    this.buttonLabel = 'Adicionar';
    this.courseForm.reset();
    this.focus.nativeElement.focus();
  }

  confirm(obj) {
    this.course = obj;
    this._messageService.add({
      key: 'confirmationKey',
      sticky: true,
      severity: 'warn',
      summary: 'Tem certeza?',
      detail: `Deseja realmente excluir '${obj.name}'?`,
    });
  }
}
