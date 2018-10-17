import { InstitutionService } from 'app/services/institution.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../../models/course.interface';
import { CourseService } from '../../../services/course.service';
import { Institution } from 'app/models/institution.interface';

@Component({  
  selector: 'aka-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  button = 'Adicionar';
  courseForm: FormGroup;
  course: Course;
  courses$: Observable<Course[]>;
  institutions$: Observable<Institution[]>;
  @ViewChild('inputFocus') focusIn: ElementRef;

  opa = {
    'uid': 'YBu8UKbebVMKlwK7Ete9',
    'name': 'Facear'
  };

  constructor(
    private _courseFormBuilder: FormBuilder,
    private _courseService: CourseService,
    private _institutionService: InstitutionService
  ) { }

  ngOnInit() {
    this.courses$ = this._courseService.get();
    this.institutions$ = this._institutionService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
  }

  onSelectInstituition(value: Institution) {
    this.courseForm.patchValue({ instituitionUid: value.uid });
  }

  buildForm() {
    this.courseForm = this._courseFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      description: [null, Validators.compose([Validators.required])],
      instituitionUid: []
    });
  }

  save() {
    if (!this.courseForm.get('uid').value) {
      this._courseService.post(this.courseForm.value);
    } else {
      this._courseService.put(this.course.uid, this.courseForm.value);
    }
    this.courseForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  edit(obj) {
    this.courseForm.patchValue({ uid: obj.uid, description: obj.description });
    this.course = obj;
    this.button = 'Atualizar';
    this.focusIn.nativeElement.focus();
  }

  remove(uid) {
    this._courseService.delete(uid);
    this.courseForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

}
