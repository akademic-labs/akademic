import { MessageService } from 'primeng/components/common/messageservice';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Course } from '../../../models/course.interface';
import { Institution } from '../../../models/institution.interface';
import { CourseService } from '../../../services/course.service';
import { InstitutionService } from '../../../services/institution.service';

@Component({
  selector: 'aka-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  @ViewChild('inputFocus') focus: ElementRef;
  courseForm: FormGroup;
  course: Course;
  courses$: Observable<Course[]>;
  institutions$: Observable<Institution[]>;
  button = 'Adicionar';

  constructor(
    private _courseFormBuilder: FormBuilder,
    private _courseService: CourseService,
    private _institutionService: InstitutionService,
    public _messageService: MessageService,
  ) { }

  ngOnInit() {
    this.courses$ = this._courseService.getWithInstitution();
    this.institutions$ = this._institutionService.getInstitutionByUF('PR');
    this.buildForm();
    this.focus.nativeElement.focus();
  }

  buildForm() {
    this.courseForm = this._courseFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.required],
      institution: [null, Validators.required]
    });
  }

  save() {
    // before submit assigns only the institution uid in the course
    this.courseForm.patchValue({ institution: this.courseForm.get('institution').value.uid });
    if (this.courseForm.get('uid').value) {
      this._courseService.put(this.course.uid, this.courseForm.value);
    } else {
      this._courseService.post(this.courseForm.value);
    }
    this.renderForm();
  }

  edit(obj) {
    const institution = { uid: obj.institution, name: obj.institution.name };
    this.courseForm.patchValue({ uid: obj.uid, name: obj.name, institution: institution });
    this.course = obj;
    this.button = 'Atualizar';
    this.focus.nativeElement.focus();
  }

  remove() {
    this._courseService.delete(this.course.uid);
    this.renderForm();
    this._messageService.clear();
  }

  renderForm() {
    this.button = 'Adicionar';
    this.courseForm.reset();
    this.focus.nativeElement.focus();
  }

  confirm(obj) {
    this.course = obj;
    this._messageService.add({
      key: 'confirmationKey', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente excluir '${obj.name}'?`
    });
  }

}
